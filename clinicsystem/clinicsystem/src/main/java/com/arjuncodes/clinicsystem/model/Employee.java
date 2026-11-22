package com.arjuncodes.clinicsystem.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String password;

    // "admin" or "employee"
    private String role;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "employee_modules",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "module_id"))
    private List<Module> allowedModules;
}
