import Module from "../repositories/models/Module";

export async function getModules() {
    const modules = await Module.findAll({
        order: [['time', 'ASC']]
    });

    return modules;
}