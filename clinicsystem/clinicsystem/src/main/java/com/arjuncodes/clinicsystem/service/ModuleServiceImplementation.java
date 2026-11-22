package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Module;
import com.arjuncodes.clinicsystem.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleServiceImplementation implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final com.arjuncodes.clinicsystem.repository.EmployeeRepository employeeRepository;

    @Override
    public List<Module> getAllModules() {
        return moduleRepository.findAllByOrderByPositionAsc();
    }

    @Override
    public List<Module> getModulesForEmployee(Long employeeId) {
        com.arjuncodes.clinicsystem.model.Employee employee = employeeRepository.findById(employeeId).orElse(null);
        if (employee == null) return List.of();
        if ("admin".equals(employee.getRole())) {
            return moduleRepository.findAllByOrderByPositionAsc();
        }
        java.util.List<Module> result = new java.util.ArrayList<>(employee.getAllowedModules());
        moduleRepository.findByCreatedBy(employeeId).forEach(m -> {
            if (result.stream().noneMatch(x -> x.getId().equals(m.getId()))) {
                result.add(m);
            }
        });
        return result;
    }

    @Override
    public Module createModule(Module module, Long employeeId) {
        module.setCreatedBy(employeeId);
        return createModule(module);
    }

    @Override
    public Module createModule(Module module) {
        List<Module> existing = moduleRepository.findAllByOrderByPositionAsc();
        if (module.getName() == null || module.getName().isEmpty()) {
            module.setName("Module " + (existing.size() + 1));
        }
        module.setPosition(existing.size());
        return moduleRepository.save(module);
    }

    @Override
    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }

    @Override
    public Module renameModule(Long id, String name) {
        Module module = moduleRepository.findById(id).orElse(null);
        if (module == null) return null;
        module.setName(name);
        return moduleRepository.save(module);
    }
}