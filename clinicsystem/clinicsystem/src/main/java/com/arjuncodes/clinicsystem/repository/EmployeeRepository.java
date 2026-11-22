package com.arjuncodes.clinicsystem.repository;

import com.arjuncodes.clinicsystem.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);
}
