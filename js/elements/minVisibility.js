const checkMinVisibilityValue = (minVisibility, avgVisibility, result, error) => {
  if (minVisibility === avgVisibility) {
    error += "Minimum Visibility and Average Visibility can't have the same value."
    return false
  } else {
    if (minVisibility < 1500) {
      result += 'Minimum Visibility is ' + minVisibility
      return true
    } else if (minVisibility >= 1500 && minVisibility < 5000 && minVisibility < 0.5 * avgVisibility) {
      result += 'Minimum Visibility is ' + minVisibility
      return true
    } else {
      error += "Min Visibility must be lower than 1500m, or when it's bigger, it should be lower than 5000m and than half of the average Visibility"
      return false
    }
  }
}

const checkMinVisibility = (minVisibility, avgVisibility, explanation, error) => {
  const minVisibilityRegExp = /^(\d{4})(N|NE|E|SW|S|SW|W|NW)?(=)?$/
  if (minVisibilityRegExp.test(minVisibility)) {
    const minVisibilityValue = minVisibility.slice(0, 3)
    if (!checkPrecision(minVisibility, error)) {
      return
    }

    if (!checkMinVisibilityValue(minVisibility, avgVisibility, error)) {
      return
    }

    if (minVisibility.length > 4) {
      const singularDirectionRegExp = /^(N|S|E|W)?(=)?$/
    }
    const composedDirectionRegExp = /^(NW|SE|NE|SW)?(=)?$/
    minVisibilityDirection = minVisibility.slice(4, 5)
  }

  if (visibilidad_minima.test(min_vis_codigo) == true && min_vis_codigo.length == 5) {	// DIRECCIÓN N, S, E, W
    if (visib_media == 'NOVIS') {
      salida_texto("<span style='color:red; font-weight:bold'>Es imposible hacer la comprobación de los requisitos de visibilidad mínima debido a que el término de visibilidad no existe o está mal escrito. Aún así se procederá con su análisis considerando una visibilidad de +10km.</span>")
      visib_media = '9999'
    }

    visib = parseInt(visib_media)
    valor_vis_min = parseInt(min_vis_codigo.slice(0, 4))
    comp_vis_min = precision(min_vis_codigo.slice(0, 4))		// COMPROBAMOS LA PRECISIÓN DE LA MAGNITUD

    if (comp_vis_min === 0) {
      return 0
    } else if (comp_vis_min == true) {
      if (valor_vis_min == visib) {			// COMPROBAMOS CONDICIONES OACI: PRIMERO QUE SEAN DISTINTAS MIN Y MEDIA
        salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe ser distinto del término de visibilidad.</span>')
        return 0
      } else {
        if (valor_vis_min < 1500) {	// SEGUNDO QUE PUEDA SER MENOR DE 1500 METROS
          if (min_vis_codigo.charAt(4) == 'N' || min_vis_codigo.charAt(4) == 'S' || min_vis_codigo.charAt(4) == 'E' || min_vis_codigo.charAt(4) == 'W') {
            salida_texto('El término de visibilidad mínima ' + min_vis_codigo + ' es correcto.')
            return true
          }
          // COMPROBAMOS TAMBIÉN QUE LA DIRECCIÓN ESTÉ BIEN EXPRESADA
          else {
            salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>')
            return 0
          }
        }
        // OTRA OPCIÓN ES ENTRE 1500 Y 5000 METROS PERO MENOR QUE EL 50% DE LA VISIBILIDAD MEDIA
        else if (valor_vis_min >= 1500 && valor_vis_min < 5000 && valor_vis_min < 0.5 * visib) {
          if (min_vis_codigo.charAt(4) == 'N' || min_vis_codigo.charAt(4) == 'S' || min_vis_codigo.charAt(4) == 'E' || min_vis_codigo.charAt(4) == 'W') {
            salida_texto('El término de visibilidad mínima ' + min_vis_codigo + ' es correcto.')
            return true		// COMPROBAMOS TAMBIÉN LAS DIRECCIONES
          } else {
            salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>')
            return 0
          }
        } else {
          salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe ser menor que 1500 m, o menor que 5000 metros y que el 50% de la visibilidad.</span>')
          return 0
        }
      }
    }
  } else if (visibilidad_minima.test(min_vis_codigo) == true && min_vis_codigo.length == 6) {	// DIRECCIÓN NW, SW, NE, SE
    visib = parseInt(visib_media)
    valor_vis_min = parseInt(min_vis_codigo.slice(0, 4))
    comp_vis_min = precision(min_vis_codigo.slice(0, 4))		// COMPROBAMOS LA PRECISIÓN DE LA MAGNITUD

    if (comp_vis_min == true) {
      if (valor_vis_min == visib) {			// COMPROBAMOS CONDICIONES OACI: PRIMERO QUE SEAN DISTINTAS MIN Y MEDIA
        salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe ser distinto del término de visibilidad.</span>')
        return 0
      } else {
        if (valor_vis_min < 1500) {	// SEGUNDO QUE PUEDA SER MENOR DE 1500 METROS
          if (min_vis_codigo.slice(4).toString() == 'NE' || min_vis_codigo.slice(4).toString() == 'NW' || min_vis_codigo.slice(4).toString() == 'SE' || min_vis_codigo.slice(4).toString() == 'SW') {
            salida_texto('El término de visibilidad mínima ' + min_vis_codigo + ' es correcto.')
            return true
          }
          // COMPROBAMOS TAMBIÉN QUE LA DIRECCIÓN ESTÉ BIEN EXPRESADA
          else {
            salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>')
            return 0
          }
        }
        // OTRA OPCIÓN ES ENTRE 1500 Y 5000 METROS PERO MENOR QUE EL 50% DE LA VISIBILIDAD MEDIA
        else if (valor_vis_min >= 1500 && valor_vis_min < 5000 && valor_vis_min < 0.5 * visib) {
          if (min_vis_codigo.slice(4).toString() == 'NE' || min_vis_codigo.slice(4).toString() == 'NW' || min_vis_codigo.slice(4).toString() == 'SE' || min_vis_codigo.slice(4).toString() == 'SW') {
            salida_texto('El término de visibilidad mínima ' + min_vis_codigo + ' es correcto.')
            return true		// COMPROBAMOS TAMBIÉN LAS DIRECCIONES
          } else {
            salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe acabar en alguna de las direcciones N, S, E, W, NE, NW, SE, SW.</span>')
            return 0
          }
        } else {
          salida_texto("<span style='color:red; font-weight:bold'>El término de visibilidad mínima " + min_vis_codigo + ' debe ser menor que 1500 m, o menor que 5000 metros y que el 50% de la visibilidad.</span>')
          return 0
        }
      }
    }
  } else {
    return false		// VARIABLE PARA COMPROBAR SI EL TÉRMINO QUE HA ENTRADO A COMPARARSE ERA DE TEMPERATURA O NO
  }
}

export default checkMinVisibility
