package com.arjuncodes.clinicsystem.service;

import com.arjuncodes.clinicsystem.model.Menu;
import java.util.List;

public interface MenuService {
    List<Menu> getAllMenus();
    List<Menu> getMenusByModuleId(Long moduleId);
    Menu createMenu(Menu menu);
    Menu updateMenu(Menu menu);
    void deleteMenu(Long id);
    Menu saveVideo(Long id, String videoData);
}