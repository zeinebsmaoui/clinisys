package com.arjuncodes.clinicsystem.config;

import com.arjuncodes.clinicsystem.model.Employee;
import com.arjuncodes.clinicsystem.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    @Override
    public void run(String... args) {
        if (employeeRepository.findByEmail("zouba123@gmail.com") == null) {
            Employee admin = new Employee();
            admin.setName("zeineb smaoui");
            admin.setEmail("zouba123@gmail.com");
            admin.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("12345"));
            admin.setRole("admin");
            admin.setAllowedModules(new ArrayList<>());
            employeeRepository.save(admin);
        }
    }
}
