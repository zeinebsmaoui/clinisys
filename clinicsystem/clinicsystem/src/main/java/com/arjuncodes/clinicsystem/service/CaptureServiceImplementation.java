package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Capture;
import com.arjuncodes.clinicsystem.repository.CaptureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CaptureServiceImplementation implements CaptureService {

    private final CaptureRepository captureRepository;

    @Override
    public List<Capture> getCapturesByMenuId(Long menuId) {
        return captureRepository.findByMenuIdOrderByPositionAsc(menuId);
    }

    @Override
    public Capture saveCapture(Capture capture) {
        List<Capture> existing = captureRepository.findByMenuIdOrderByPositionAsc(capture.getMenu().getId());
        capture.setPosition(existing.size());
        return captureRepository.save(capture);
    }

    @Override
    public void deleteCapture(Long id) {
        captureRepository.deleteById(id);
    }

    @Override
    public void updatePositions(List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            Capture capture = captureRepository.findById(orderedIds.get(i)).orElse(null);
            if (capture != null) {
                capture.setPosition(i);
                captureRepository.save(capture);
            }
        }
    }

    @Override
    public Capture updateCapture(Capture capture) {
        return captureRepository.save(capture);
    }
}