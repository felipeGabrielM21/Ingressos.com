package com.compras.ingressos;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationSuccessHandler;

import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class ConfiguracoesDeSeguranca {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // desativa CSRF para facilitar testes com formulário
                .csrf(csrf -> csrf.disable())

                // configuração CORS caso use front separado
                .cors(cors -> cors.configurationSource(request -> {
                    var config = new org.springframework.web.cors.CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://127.0.0.1:5500")); // seu frontend
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(true);
                    return config;
                }))

                // define quais endpoints são liberados
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/css/**", "/js/**", "/assets/**", "/cadastro/**", "/login", "/eventos", "/api/compra/**").permitAll()
                        .anyExchange().authenticated()
                )

                // configura o form login padrão
                .formLogin(form -> form
                        .loginPage("/login") // sua página customizada
                        .authenticationSuccessHandler(new RedirectServerAuthenticationSuccessHandler("/eventos"))
                        .authenticationFailureHandler((webFilterExchange, exception) -> {
                            // caso login falhe, permanece na página de login
                            return webFilterExchange.getExchange().getResponse().setComplete();
                        })
                )

                // configura logout
                .logout(logout -> logout.logoutUrl("/logout"))

                .build();
    }

    // Bean para criptografar a senha
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
