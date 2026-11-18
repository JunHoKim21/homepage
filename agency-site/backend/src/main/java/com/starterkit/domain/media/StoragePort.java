package com.starterkit.domain.media;

import java.io.InputStream;
import java.nio.file.Path;

public interface StoragePort {
    Path saveBytes(MediaFile.Visibility visibility, String relativeKey, byte[] content);
    InputStream openPrivateStream(String relativeKey);
    void deleteQuietly(MediaFile.Visibility visibility, String relativeKey);
}
