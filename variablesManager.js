
  let values = undefined;

  // Types: string, boolean, number, object, array
  function save(collection, key, value, options) {
    if (options.costant === null) options.constant = false;
    if (options.type === null) {
      options.type = "string";
      options.value = String(value);
    }
    if (values.readOnly)
      throw new Error(
        "Global variables are read-only. You can change it in the dashboard."
      );
  
    if (values.collections?.[collection]?.[key]?.constant == true)
      throw new Error("Trying to assign value to a constant key");
  
    if (values.collections?.[collection]?.[key]?.constantType == true) {
      let expectedType = values.collections?.[collection]?.[key]?.type;
      if (expectedType != options.type)
        throw new Error(
          "Expected type '" + expectedType + "' but got '" + options.type + "'"
        );
    }
    values.collections[collection] = value;
  }
  
  function get(collection, key) {
    return values.collections?.[collection]?.[key];
  }
  
  function deleteKey(collection, key) {
    if (values.collections?.[collection]?.[key]?.constant)
      throw new Error("You cannot delete a constant key");
    delete values.collections?.[collection]?.[key];
  }
  
  module.exports = { save, get, deleteKey }
  