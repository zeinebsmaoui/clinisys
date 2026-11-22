package com.arjuncodes.clinicsystem.repository;

import com.arjuncodes.clinicsystem.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findAllByOrderByPositionAsc();
    List<Module> findByCreatedBy(Long createdBy);
}