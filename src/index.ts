import IoT from "@dkaframework/iot";

(() => {
    const STB = new IoT.s905x.HG680P();

    STB.power("off");
    STB.ir("off");
    STB.lan("off");
})();