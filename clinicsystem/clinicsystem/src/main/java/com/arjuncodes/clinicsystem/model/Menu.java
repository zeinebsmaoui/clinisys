package com.arjuncodes.clinicsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String icon;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Menu parent;

    private boolean hasAdd;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    @Column(columnDefinition = "LONGTEXT")
    private String videoData;
}