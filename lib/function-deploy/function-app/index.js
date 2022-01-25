// TODO figure out best way to write in / pass function name
const args = process.argv.slice(2);
console.log(args);
const FUNCTION_NAME = args[0];
const FUNCTION_ADDRESS = process.env.MEROXA_FUNCTION_ADDRESS;
const PROTO_PATH = __dirname + "/proto/service.proto";

const dataApp = require("../data-app");

function process(call, callback) {
  callback(null, {
    records: dataApp[FUNCTION_NAME](call.request.records),
  });
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
server.addService(serviceProto.Function.service, { process });
server.bindAsync(
  FUNCTION_ADDRESS,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server started at ${FUNCTION_ADDRESS}`);
  }
);
