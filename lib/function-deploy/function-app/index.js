// TODO figure out best way to write in / pass function name
const args = process.argv.slice(2);
const FUNCTION_NAME = args[0];
// TODO Update this when full address is returned as part of env.
const FUNCTION_ADDRESS = `0.0.0.0${process.env.MEROXA_FUNCTION_ADDR}`;

const PROTO_PATH = __dirname + "/proto/service.proto";
const Record = require("./record");

const dataApp = require("../data-app");

function processFunction(call, callback) {
  const inputRecords = call.request.records.map((record) => {
    return new Record(record);
  });

  const dataAppFunction = dataApp[FUNCTION_NAME];

  const outputRecords = dataAppFunction(inputRecords);

  const records = outputRecords.map((record) => {
    return record.serialize();
  });

  callback(null, {
    records,
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
