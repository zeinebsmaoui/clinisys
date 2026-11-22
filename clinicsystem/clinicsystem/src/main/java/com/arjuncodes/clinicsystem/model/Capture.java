package com.arjuncodes.clinicsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "captures")
public class Capture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;

    private int position;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;
}