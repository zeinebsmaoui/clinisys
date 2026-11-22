package com.arjuncodes.clinicsystem.repository;

import com.arjuncodes.clinicsystem.model.Capture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CaptureRepository extends JpaRepository<Capture, Long> {
    List<Capture> findByMenuIdOrderByPositionAsc(Long menuId);

    @Transactional
    void deleteByMenuId(Long menuId);
}