package com.arjuncodes.clinicsystem.controller;

import com.arjuncodes.clinicsystem.model.Menu;
import com.arjuncodes.clinicsystem.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost"})
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        return ResponseEntity.ok(menuService.getAllMenus());
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<Menu>> getMenusByModuleId(@PathVariable Long moduleId) {
        return ResponseEntity.ok(menuService.getMenusByModuleId(moduleId));
    }

    @PostMapping
    public ResponseEntity<Menu> createMenu(@RequestBody Menu menu) {
        return ResponseEntity.ok(menuService.createMenu(menu));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        menu.setId(id);
        return ResponseEntity.ok(menuService.updateMenu(menu));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/video")
    public ResponseEntity<Menu> saveVideo(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(menuService.saveVideo(id, body.get("videoData")));
    }
}
