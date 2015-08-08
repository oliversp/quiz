var models = require('../models/models.js')


// GET /statistics
exports.index = function(req, res, next) {

	var _statistics = [];

//Preguntas	
models.Quiz.count().then(
		function (NPreguntas) {
			_statistics.push({question: 'Nº de preguntas', dato: NPreguntas});
			
//Comentarios		
models.Comment.count().then(
		function (NComentarios) {
			_statistics.push({question: 'Nº de comentarios totales', dato: NComentarios});
			if (_statistics[0].dato) {
					_statistics.push({question: 'Nº medio de comentarios por pregunta', dato: (NComentarios / _statistics[0].dato).toFixed(2)});
			};
models.Quiz.count({
		include: [ {model: models.Comment, required: true} ],
		distinct: true	}).then(
						function(NPregComents) {
							_statistics.push({question: 'Nº preguntas con comentarios', dato: NPregComents});
							_statistics.push({question: 'Nº preguntas sin comentarios', dato: _statistics[0].dato - NPregComents});
							res.render('statistics/index.ejs', {statistics: _statistics, errors: []});
						}
					).catch(function(error) { next(error); });

				}
			).catch(function(error) { next(error); });
				}
	).catch(function(error) { next(error); });


};

