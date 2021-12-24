// TODO figure out best way to write in / pass function name
const FUNCTION_NAME = "Anonymize";
const FUNCTION_ADDRESS = process.env.MEROXA_FUNCTION_ADDRESS;
const PROTO_PATH = __dirname + "/proto/service.proto";

// TODO figure out best way to write in / pass in user's data app package
const dataApp = require("../simple/index");

function Process(call, callback) {
  // TODO solve discrepancy between Record and list of Records for function argument
  callback(null, dataApp[FUNCTION_NAME](call.request));
}

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
});

const serviceProto =
  grpc.loadPackageDefinition(packageDefinition).io.meroxa.funtime.proto;

const server = new grpc.Server();
server.addService(serviceProto.Function.service, { Process });
server.bindAsync(
  FUNCTION_ADDRESS,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server started at ${FUNCTION_ADDRESS}`);
  }
);
