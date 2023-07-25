package com.ssafy.ssaout;


import com.ssafy.ssaout.config.properties.AppProperties;
import com.ssafy.ssaout.config.properties.CorsProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
		CorsProperties.class,
		AppProperties.class
})
public class SsaoutApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsaoutApplication.class, args);
	}

}
