package com.arjuncodes.clinicsystem.controller;

import com.arjuncodes.clinicsystem.model.Capture;
import com.arjuncodes.clinicsystem.model.Menu;
import com.arjuncodes.clinicsystem.repository.CaptureRepository;
import com.arjuncodes.clinicsystem.service.CaptureService;
import com.arjuncodes.clinicsystem.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/captures")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost"})
public class CaptureController {

    private final CaptureService captureService;
    private final FileStorageService fileStorageService;
    private final CaptureRepository captureRepository;

    @GetMapping
    public ResponseEntity<List<Capture>> getAllCaptures() {
        return ResponseEntity.ok(captureRepository.findAll());
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<List<Capture>> getCapturesByMenuId(@PathVariable Long menuId) {
        return ResponseEntity.ok(captureService.getCapturesByMenuId(menuId));
    }

    @PostMapping
    public ResponseEntity<Capture> uploadCapture(
            @RequestParam("file") MultipartFile file,
            @RequestParam("menuId") Long menuId) throws IOException {

        String imageUrl = fileStorageService.saveFile(file);

        Capture capture = new Capture();
        capture.setName(file.getOriginalFilename());
        capture.setImageUrl(imageUrl);
        Menu menu = new Menu();
        menu.setId(menuId);
        capture.setMenu(menu);

        return ResponseEntity.ok(captureService.saveCapture(capture));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCapture(@PathVariable Long id) {
        captureService.deleteCapture(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/reorder")
    public ResponseEntity<Void> reorder(@RequestBody List<Long> orderedIds) {
        captureService.updatePositions(orderedIds);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Capture> updateCapture(@PathVariable Long id, @RequestBody Capture capture) {
        Capture existing = captureRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();
        existing.setDescription(capture.getDescription());
        existing.setName(capture.getName());
        if (capture.getImageUrl() != null && !capture.getImageUrl().isEmpty()) {
            existing.setImageUrl(capture.getImageUrl());
        }
        return ResponseEntity.ok(captureService.updateCapture(existing));
    }

    @PutMapping("/replace/{id}")
    public ResponseEntity<Capture> replaceImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("menuId") Long menuId) throws IOException {

        Capture existing = captureRepository.findById(id).orElse(null);
        if (existing == null) return ResponseEntity.notFound().build();

        String imageUrl = fileStorageService.saveFile(file);
        existing.setImageUrl(imageUrl);
        existing.setName(file.getOriginalFilename());

        return ResponseEntity.ok(captureService.updateCapture(existing));
    }
}
