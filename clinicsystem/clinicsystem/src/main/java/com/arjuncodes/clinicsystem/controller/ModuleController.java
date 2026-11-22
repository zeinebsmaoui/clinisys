package com.arjuncodes.clinicsystem.controller;

import com.arjuncodes.clinicsystem.model.Module;
import com.arjuncodes.clinicsystem.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost"})
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<Module>> getAllModules(@RequestParam(required = false) Long employeeId) {
        if (employeeId != null) {
            return ResponseEntity.ok(moduleService.getModulesForEmployee(employeeId));
        }
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @PostMapping
    public ResponseEntity<Module> createModule(@RequestBody Module module, @RequestParam(required = false) Long employeeId) {
        if (employeeId != null) {
            return ResponseEntity.ok(moduleService.createModule(module, employeeId));
        }
        return ResponseEntity.ok(moduleService.createModule(module));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Module> renameModule(@PathVariable Long id, @RequestBody Module module) {
        module.setId(id);
        return ResponseEntity.ok(moduleService.renameModule(id, module.getName()));
    }
}
