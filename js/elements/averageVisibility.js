const checkVisibility = (visibility, explanation) => {		//CONDICIONES OACI DE VISIBILIDAD MEDIA
	const visibilityRegExp = /^(\d{4})(=)?$/;
	
	if (visibilityRegExp.test(vis_codigo) == true){
		let visibilityValue = visibility.slice (0, 3)		
		if (!checkPrecision (visibilityValue)){
            return
        } else {
            explanation += "Visibility is " + visibilityValue
        }
	}
}