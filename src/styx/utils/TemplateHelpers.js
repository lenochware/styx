var Styx = Styx || {};
Styx.utils = Styx.utils || {};


Styx.utils.TemplateHelpers = class
{
	meter(cssClass, current, max)
	{
		return `<meter class="meter ${cssClass}" min="0" max="${max}" optimum="${max}" low="${max*.2}" high="${max*.8}" value="${current}">${current}</meter>`;
	}

	meterSimple(current, max)
	{
		return `<meter class="meter" min="0" max="${max}" value="${current}">${current}</meter>`;
	}
}