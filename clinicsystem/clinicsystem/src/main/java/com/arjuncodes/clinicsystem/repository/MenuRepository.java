package com.arjuncodes.clinicsystem.repository;

import com.arjuncodes.clinicsystem.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByParentIsNull();
    List<Menu> findByModuleId(Long moduleId);
    List<Menu> findByParentId(Long parentId);
}