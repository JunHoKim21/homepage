package com.starterkit.infra.config;

import com.starterkit.common.config.FeatureSwitch;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class StarterFeatureSwitchAdapter implements FeatureSwitch {

    private final StarterProperties starterProperties;

    @Override
    public boolean isPaymentEnabled() {
        return starterProperties.features().paymentEnabled();
    }

    @Override
    public boolean isAuditLogEnabled() {
        return starterProperties.features().auditLogEnabled();
    }

    @Override
    public boolean isExcelExportEnabled() {
        return starterProperties.features().excelExportEnabled();
    }
}
