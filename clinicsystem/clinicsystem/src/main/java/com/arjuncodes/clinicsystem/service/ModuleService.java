package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Module;
import java.util.List;

public interface ModuleService {
    List<Module> getAllModules();
    List<Module> getModulesForEmployee(Long employeeId);
    Module createModule(Module module, Long employeeId);
    Module createModule(Module module);
    void deleteModule(Long id);
    Module renameModule(Long id, String name);
}