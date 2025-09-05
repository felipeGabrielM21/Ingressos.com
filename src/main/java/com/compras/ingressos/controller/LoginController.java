package com.compras.ingressos.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin("*")
@Controller
public class LoginController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/eventos")
    public String eventos() {
        return "eventos";
    }

    @GetMapping("/api/compra")
    public String compra() {
        return "compra";
    }

    @GetMapping("/cadastro")
    public String cadastro() {
        return "cadastro";
    }
}