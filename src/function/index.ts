import path from "path";
import { RecordsArray } from "./records";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const health = require("grpc-js-health-check");

export class FunctionServer {
  functionName: string;
  functionAddress: string;
  dataApp: any;
  protoPath: string;

  constructor(
    functionName: string,
    functionAddress: string,
    pathToDataApp: string
  ) {
    this.functionName = functionName;
    this.functionAddress = functionAddress;

    this.protoPath = path.resolve(__dirname, "..", "..", "proto", "service.proto");

    const DataApp = require(pathToDataApp).App;
    this.dataApp = new DataApp();
  }

  get dataAppFunction() {
    return this.dataApp[this.functionName];
  }

  processFunction(call: any, callback: any) {
    const inputRecords = new RecordsArray();
    call.request.records.map((record: any) => {
      inputRecords.pushRecord(record);
    });

    Promise.resolve(this.dataAppFunction(inputRecords)).then(
      (outputRecords) => {
        if (!Array.isArray(outputRecords)) {
          throw new Error("Invalid records");
        }

        const records = outputRecords.map((record: any) => {
          return record.serialize();
        });

        callback(null, { records });
      }
    );
  }

  start() {
    const packageDefinition = protoLoader.loadSync(this.protoPath, {
      keepCase: true,
      defaults: true,
    });

    const serviceProto =
      grpc.loadPackageDefinition(packageDefinition).io.meroxa.funtime;

    const server = new grpc.Server();

    const statusMap = {
      function: health.servingStatus.SERVING,
    };

    const healthImpl = new health.Implementation(statusMap);

    server.addService(serviceProto.Function.service, {
      process: this.processFunction.bind(this),
    });
    server.addService(health.service, healthImpl);

    server.bindAsync(
      this.functionAddress,
      grpc.ServerCredentials.createInsecure(),
      () => {
        server.start();
        console.log(`gRPC server started at ${this.functionAddress}`);
      }
    );
  }
}
