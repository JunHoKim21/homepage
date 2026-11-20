package com.starterkit.infra.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 768MB 컨테이너 메모리 상한 방어 및 가상 스레드 Pinning 방지를 위한 전용 스레드 풀 설정.
 * CPU 집약적인 이미지 디코딩/WebP 변환 작업은 반드시 단일 플랫폼 스레드 풀(Pool=1, Queue=50)에서 순차 처리합니다.
 */
@Configuration
@RequiredArgsConstructor
public class AsyncAndThreadPoolConfig {

    private final StarterProperties starterProperties;

    @Bean(name = "imagePlatformExecutor", destroyMethod = "shutdown")
    public ExecutorService imagePlatformExecutor() {
        int poolSize = Math.max(1, starterProperties.imageWorker().corePoolSize());
        int queueCapacity = Math.max(1, starterProperties.imageWorker().queueCapacity());

        ThreadFactory platformThreadFactory = new ThreadFactory() {
            private final AtomicInteger seq = new AtomicInteger(1);

            @Override
            public Thread newThread(Runnable r) {
                Thread thread = new Thread(r, "image-webp-worker-" + seq.getAndIncrement());
                thread.setDaemon(false);
                thread.setPriority(Thread.NORM_PRIORITY);
                return thread;
            }
        };

        return new ThreadPoolExecutor(
                poolSize,
                poolSize,
                0L,
                TimeUnit.MILLISECONDS,
                new ArrayBlockingQueue<>(queueCapacity),
                platformThreadFactory,
                new ThreadPoolExecutor.AbortPolicy()
        );
    }
}
