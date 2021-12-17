exports.Platform = class Platform {
  registeredFunctions = {};

  constructor(meroxaAPI) {
    this.client = meroxaAPI;
  }

  resources(resourceName) {
    const resource = this.client.getResourceByNameOrID(resourceName);
    return new Resource(resource, client);
  }

  process(records, fn) {
    this.registeredFunctions[fn.name] = fn;
    // TODO deploy function, etc. etc.
  }
};

class Resource {
  constructor(resource, client) {
    const { id, name, type } = resource;
    this.id = id;
    this.name = name;
    this.type = type;
    this.client = client;
  }
}
