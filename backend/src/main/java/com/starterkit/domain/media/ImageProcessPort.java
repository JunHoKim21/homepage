package com.starterkit.domain.media;

import java.nio.file.Path;

public interface ImageProcessPort {
    void inspectDimensionsOrThrow(byte[] imageBytes);
    void submitPublicImageDietJob(Long mediaFileId, Path rawTempFile, String baseRelativeDir, String fileStem);
}
