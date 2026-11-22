package com.arjuncodes.clinicsystem.controller;

import com.arjuncodes.clinicsystem.model.Employee;
import com.arjuncodes.clinicsystem.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost"})
public class AuthController {

    private final EmployeeRepository employeeRepository;

    @PostMapping("/login")
    public ResponseEntity<Employee> login(@RequestBody Map<String, String> credentials) {
        Employee employee = employeeRepository.findByEmail(credentials.get("email"));
        if (employee == null || !new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(credentials.get("password"), employee.getPassword())) {
            return ResponseEntity.status(401).build();
        }
        employee.setPassword(null);
        return ResponseEntity.ok(employee);
    }
}
