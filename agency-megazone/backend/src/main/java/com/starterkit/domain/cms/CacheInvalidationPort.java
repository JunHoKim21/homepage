package com.starterkit.domain.cms;

public interface CacheInvalidationPort {
    void revalidateNextJsTag(String tag);
}
