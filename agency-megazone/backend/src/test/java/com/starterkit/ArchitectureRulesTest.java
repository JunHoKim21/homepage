package com.starterkit;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;

import static com.tngtech.archunit.base.DescribedPredicate.anyElementThat;
import static com.tngtech.archunit.core.domain.properties.CanBeAnnotated.Predicates.annotatedWith;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noMethods;

@AnalyzeClasses(packages = "com.starterkit", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureRulesTest {

    // 1. Domain 계층은 API(컨트롤러/DTO)나 Infra(외부 어댑터 구현체)를 참조할 수 없다.
    @ArchTest
    static final ArchRule domain_must_not_depend_on_api_or_infra =
            noClasses().that().resideInAPackage("..domain..")
                    .should().dependOnClassesThat().resideInAnyPackage("..api..", "..infra..")
                    .allowEmptyShould(true);

    // 2. Public API와 Admin API 컨트롤러는 서로를 참조할 수 없다.
    @ArchTest
    static final ArchRule public_and_admin_api_must_be_isolated =
            noClasses().that().resideInAPackage("..api.publicapi..")
                    .should().dependOnClassesThat().resideInAPackage("..api.adminapi..")
                    .allowEmptyShould(true);

    // 3. JPA @Entity는 Controller 요청/응답 시그니처로 직접 노출될 수 없다 (DTO 변환 강제).
    @ArchTest
    static final ArchRule entities_must_not_leak_to_controllers =
            noMethods().that().areDeclaredInClassesThat().resideInAPackage("..api..")
                    .should().haveRawReturnType(annotatedWith(Entity.class))
                    .orShould().haveRawParameterTypes(anyElementThat(annotatedWith(Entity.class)))
                    .allowEmptyShould(true);
}
