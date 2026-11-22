package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Menu;
import com.arjuncodes.clinicsystem.repository.CaptureRepository;
import com.arjuncodes.clinicsystem.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuServiceImplementation implements MenuService {

    private final MenuRepository menuRepository;
    private final CaptureRepository captureRepository;

    @Override
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    @Override
    public List<Menu> getMenusByModuleId(Long moduleId) {
        return menuRepository.findByModuleId(moduleId);
    }

    @Override
    public Menu createMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    public Menu updateMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    @Override
    @Transactional
    public void deleteMenu(Long id) {
        List<Menu> children = menuRepository.findByParentId(id);
        for (Menu child : children) {
            captureRepository.deleteByMenuId(child.getId());
            menuRepository.deleteById(child.getId());
        }
        captureRepository.deleteByMenuId(id);
        menuRepository.deleteById(id);
    }

    @Override
    public Menu saveVideo(Long id, String videoData) {
        Menu menu = menuRepository.findById(id).orElse(null);
        if (menu == null) return null;
        menu.setVideoData(videoData);
        return menuRepository.save(menu);
    }


}