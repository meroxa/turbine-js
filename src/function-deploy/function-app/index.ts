const args = process.argv.slice(2);
const FUNCTION_NAME = args[0];
const FUNCTION_ADDRESS = process.env.MEROXA_FUNCTION_ADDR;

const PROTO_PATH = __dirname + "/proto/service.proto";
import { Record } from "./record";

const DataApp = require("../data-app").App;
const dataApp = new DataApp();

function processFunction(call: any, callback: any) {
  const inputRecords = call.request.records.map((record: any) => {
    return new Record(record);
  });

  const dataAppFunction = dataApp[FUNCTION_NAME];

  Promise.resolve(dataAppFunction(inputRecords)).then((outputRecords) => {
    if (!Array.isArray(outputRecords)) {
      throw new Error("Invalid records");
    }

    const records = outputRecords.map((record: any) => {
      return record.serialize();
    });

    callback(null, { records });
  });
}

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
});

const serviceProto =
  grpc.loadPackageDefinition(packageDefinition).io.meroxa.funtime;

const server = new grpc.Server();
const health = require("grpc-js-health-check");

const statusMap = {
  function: health.servingStatus.SERVING,
};

const healthImpl = new health.Implementation(statusMap);

server.addService(serviceProto.Function.service, { process: processFunction });
server.addService(health.service, healthImpl);

server.bindAsync(
  FUNCTION_ADDRESS,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server started at ${FUNCTION_ADDRESS}`);
  }
);
