package com.github.kornilova_l.plugin.execution;

import com.github.kornilova_l.config.ConfigStorage;
import com.github.kornilova_l.profiler.ProfilerFileManager;
import com.intellij.execution.ExecutionException;
import com.intellij.execution.configurations.*;
import com.intellij.execution.impl.DefaultJavaProgramRunner;
import com.intellij.execution.runners.ExecutionEnvironment;
import com.intellij.openapi.application.PathManager;
import com.intellij.openapi.components.PersistentStateComponent;
import com.intellij.openapi.project.Project;
import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.util.Objects;

/**
 * ProgramRunner which runs Profiler Executor
 */
public class ProfilerProgramRunner extends DefaultJavaProgramRunner {
    private static final String RUNNER_ID = "ProfileRunnerID";
    ConfigStorage.Config config;
    private Project project;

    public ProfilerProgramRunner() {
        super();
    }

    @Override
    public void execute(@NotNull ExecutionEnvironment environment) throws ExecutionException {
        project = environment.getProject();
        config = ((ConfigStorage) environment.getProject().getComponent(PersistentStateComponent.class)).getState();
        super.execute(environment);
    }

    @Override
    public void patch(JavaParameters javaParameters,
                      RunnerSettings settings,
                      RunProfile runProfile,
                      boolean beforeExecution) throws ExecutionException {
        assert (config != null);
        assert (project != null);
        ProfilerFileManager.setPathToPluginDir(PathManager.getSystemPath());
        File configFile = ProfilerFileManager.getConfigFile(project.getName());
        config.exportConfig(configFile);
        javaParameters.getVMParametersList().add(
                "-javaagent:/home/lk/java-profiling-plugin/build/libs/javaagent.jar=" +
                        PathManager.getSystemPath() +
                        "&" +
                        configFile.getAbsolutePath()
        );
    }

    @NotNull
    @Override
    public String getRunnerId() {
        return RUNNER_ID;
    }

    @Override
    public boolean canRun(@NotNull String executorId, @NotNull RunProfile profile) {
        return Objects.equals(executorId, ProfilerExecutor.EXECUTOR_ID);
    }
}
