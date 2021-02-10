package model.hystix;

import com.netflix.hystrix.HystrixCommand;
import com.netflix.hystrix.HystrixCommandGroupKey;

import java.util.function.Supplier;

public class CommonHystrixCommand<T> extends HystrixCommand<T> {

    Supplier<T> execute;
    Supplier<T> fallback;

    public CommonHystrixCommand(String group, Supplier<T> execute) {
        super(HystrixCommandGroupKey.Factory.asKey(group));
        this.execute = execute;
    }

    public CommonHystrixCommand(Setter config, Supplier<T> execute) {
        super(config);
        this.execute = execute;
    }

    public CommonHystrixCommand(String group, Supplier<T> execute, Supplier<T> fallback) {
        this(group, execute);
        this.fallback = fallback;
    }

    public CommonHystrixCommand(Setter config, Supplier<T> execute, Supplier<T> fallback) {
        this(config, execute);
        this.fallback = fallback;
    }

    @Override
    protected T run() throws Exception {
        return execute.get();
    }

    @Override
    public T getFallback() {
        if(fallback != null){
            return fallback.get();
        }
        return super.getFallback();
    }
}
