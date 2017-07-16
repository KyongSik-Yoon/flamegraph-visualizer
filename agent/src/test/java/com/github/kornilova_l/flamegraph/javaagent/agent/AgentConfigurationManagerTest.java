package com.github.kornilova_l.flamegraph.javaagent.agent;

import com.github.kornilova_l.flamegraph.configuration.MethodConfig;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import static org.junit.Assert.*;

public class AgentConfigurationManagerTest {
    private AgentConfigurationManager configurationManager;

    @Before
    public void setUp() {
        List<String> configLines = new ArrayList<>();
        configLines.add("samples.*.main(*)");
        configLines.add("samples.OtherClass.main(*)");
        configLines.add("samples.CheckIncomingCalls.fun1(boolean)");
        configLines.add("samples.CheckIncomingCalls.fun2(int+, *)");
        configLines.add("samples.CheckIncomingCalls.fun2(int, java.lang.String+)+");
        configLines.add("!samples.CheckIncomingCalls.fun2(int, boolean)");
        configLines.add("!samples.CheckIncomingCalls.fun2(int, long, *)");
        configurationManager = new AgentConfigurationManager(configLines);
    }

    @Test
    public void findIncludingConfigsForClass() throws Exception {
        Set<MethodConfig> config = new TreeSet<>();
        config.add(new MethodConfig("samples.*", "main", "(*)"));
        config.add(new MethodConfig(
                "samples.CheckIncomingCalls",
                "fun1",
                "(boolean)"
        ));
        config.add(new MethodConfig(
                "samples.CheckIncomingCalls",
                "fun2",
                "(int+, *)"
        ));
        config.add(new MethodConfig(
                "samples.CheckIncomingCalls",
                "fun2",
                "(int, java.lang.String+)+"
        ));
        assertTrue(config.equals(configurationManager.findIncludingConfigs("samples/CheckIncomingCalls")));
    }

    @Test
    public void newMethodConfig() throws Exception {
        assertEquals("MyClass.someMethod()",
                AgentConfigurationManager.newMethodConfig(
                        "MyClass",
                        "someMethod",
                        "()V"
                ).toString());

        assertEquals("my_package.MyClass.someMethod()",
                AgentConfigurationManager.newMethodConfig(
                        "my_package.MyClass",
                        "someMethod",
                        "()V"
                ).toString());

        assertEquals("my_package.MyClass.someMethod(java.lang.String)",
                AgentConfigurationManager.newMethodConfig(
                        "my_package.MyClass",
                        "someMethod",
                        "(Ljava/lang/String;)V"
                ).toString());

        assertEquals("my_package.MyClass.someMethod(java.lang.String[][], int)",
                AgentConfigurationManager.newMethodConfig(
                        "my_package.MyClass",
                        "someMethod",
                        "([[Ljava/lang/String;I)V"
                ).toString());

        // nested class
        assertEquals("my_package.SomeClass$NestedClass.someMethod(boolean, byte, short[][])",
                AgentConfigurationManager.newMethodConfig(
                        "my_package.SomeClass$NestedClass",
                        "someMethod",
                        "(ZB[[S)V"
                ).toString());

        // (LSomeClass$NestedStaticClass;)V
        // nested class as a parameter
        assertEquals("my_package.SomeClass$NestedClass.someMethod(SomeClass$NestedStaticClass)",
                AgentConfigurationManager.newMethodConfig(
                        "my_package.SomeClass$NestedClass",
                        "someMethod",
                        "(LSomeClass$NestedStaticClass;)V"
                ).toString());
    }

    @Test
    public void isMethodExcluded() throws Exception {
        assertFalse(configurationManager.isMethodExcluded(
                new MethodConfig(
                        "samples.CheckIncomingCalls",
                        "fun2",
                        "(int)"
                )
        ));
        assertTrue(configurationManager.isMethodExcluded(
                new MethodConfig(
                        "samples.CheckIncomingCalls",
                        "fun2",
                        "(int, boolean)"
                )
        ));
        assertTrue(configurationManager.isMethodExcluded(
                new MethodConfig(
                        "samples.CheckIncomingCalls",
                        "fun2",
                        "(int, long)"
                )
        ));
        assertTrue(configurationManager.isMethodExcluded(
                new MethodConfig(
                        "samples.CheckIncomingCalls",
                        "fun2",
                        "(int, long, boolean)"
                )
        ));
    }

    @Test
    public void findIncludingConfigsForMethod() throws Exception {
        Set<MethodConfig> config = new TreeSet<>();
        config.add(new MethodConfig(
                "samples.CheckIncomingCalls",
                "fun2",
                "(int+, *)"
        ));
        config.add(new MethodConfig(
                "samples.CheckIncomingCalls",
                "fun2",
                "(int, java.lang.String+)+"
        ));

        AgentConfigurationManager.findIncludingConfigs(config,
                new MethodConfig("samples.CheckIncomingCalls",
                        "fun2",
                        "(int, java.lang.String+)+"));
    }

    @Test
    public void setSaveParameters() {
        MethodConfig trueMethodConfig = new MethodConfig(
                "samples.MyClass",
                "fun",
                "(int, samples.MyClass$MyInnerClass, long, lang.java.String, boolean)");
        Set<MethodConfig> config = new TreeSet<>();
        config.add(new MethodConfig(
                "samples.*",
                "*",
                "(int+, samples.MyClass$MyInnerClass, long+, lang.java.String, *)"
        ));
        config.add(new MethodConfig(
                "samples.*",
                "*",
                "(int, samples.MyClass$MyInnerClass, long, *)+"
        ));
        config.add(new MethodConfig(
                "samples.*",
                "*",
                "(int, samples.MyClass$MyInnerClass, long, *+)+"
        ));
        AgentConfigurationManager.setSaveParameters(trueMethodConfig, config);
        assertEquals("samples.MyClass.fun(int+, samples.MyClass$MyInnerClass, long+, lang.java.String+, boolean+)+",
                trueMethodConfig.toString());
    }

}