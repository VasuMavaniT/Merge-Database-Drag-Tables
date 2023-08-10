let cachedSchemas = null;

export const get_all_schemas = async () => {
    // if (cachedSchemas !== null) {
    //     return cachedSchemas;
    // }

    console.log("Fetching data");
    const url = 'http://127.0.0.1:7777/schemawise_table';

    const response = await fetch(url);
    cachedSchemas = await response.json();
    return cachedSchemas;
};

// schemawise_table

export const get_all_schemas_without_cache = async () => {
    console.log("Fetching data");
    const url = 'http://127.0.0.1:7777/list_of_schemas';

    const response = await fetch(url);
    return await response.json();
};


export const get_all_tables = async (schema) => {
    if (cachedSchemas !== null) {
        return cachedSchemas[schema];
    }
    cachedSchemas = await get_all_schemas();
    return cachedSchemas[schema];
    // const url = `http://127.0.0.1:7777/get_all_tables?schema=${schema}`;
    // const response = await fetch(url);
    // return response.json();
};