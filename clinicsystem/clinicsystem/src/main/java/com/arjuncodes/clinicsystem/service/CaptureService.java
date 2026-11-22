package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Capture;
import java.util.List;

public interface CaptureService {
    List<Capture> getCapturesByMenuId(Long menuId);
    Capture saveCapture(Capture capture);
    void deleteCapture(Long id);
    void updatePositions(List<Long> orderedIds);
    Capture updateCapture(Capture capture);
}