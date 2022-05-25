#include <stdio.h>
#include <iostream>
#include <emscripten/emscripten.h>


class TestClass {
    public:
        TestClass(): member(10) {
        }
        void set(int in) {
            member = in;
        }
        int get() {
            return member;
        }
    private:
        int member;
};

TestClass g_tc;

int main() {
    TestClass t;
    std::cout << "From local:" << t.get() << std::endl;
    t.set(20);
    std::cout << "t.set(20) > " << t.get() << std::endl;
    std::cout << "From global:" << g_tc.get() << std::endl;
    g_tc.set(20);
    std::cout << "g_tc.set(20) > " << g_tc.get() << std::endl;
    return 0;
}


void set(int in) {
    g_tc.set(in);
}

int get() {
    return g_tc.get();
}

int EMSCRIPTEN_KEEPALIVE Sum(int a, int b) {
    return a + b;
}
