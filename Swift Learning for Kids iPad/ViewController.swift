//
//  ViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 5/5/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import CoreData


class ViewController: UIViewController{

    @IBOutlet weak var botonSpanish: UIButton!
    @IBOutlet weak var botonEureska: UIButton!
    
    
    @IBOutlet weak var etiquetaHola: UILabel!
    
    
    @IBOutlet weak var etiquetaaKaixo: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.botonSpanish.layer.cornerRadius = 15.0
        self.botonEureska.layer.cornerRadius = 15.0
        
        self.botonSpanish.isHidden = true
        self.botonEureska.isHidden = true
        
        self.etiquetaHola.isHidden = true
        self.etiquetaaKaixo.isHidden = true
        
        
        self.empezarInfo()
        
    }
    
    
    func empezarInfo()
    {
        
        
        self.deleteData();
        let activityIndicator = UIActivityIndicatorView(style: .gray)
        
        // Add it to the view where you want it to appear
        view.addSubview(activityIndicator)
        
        
        activityIndicator.transform = CGAffineTransform(scaleX: 3, y: 3)
        
        // Set up its size (the super view bounds usually)
        activityIndicator.frame = view.bounds
        // Start the loading animation
        activityIndicator.startAnimating()
        
        // To remove it, just call removeFromSuperview()
        //activityIndicator.removeFromSuperview()
        
        
        
        guard let datos = URL(string: "http://142.93.52.189/total/") else { return  }
        
        let url = URLRequest(url:datos)
        URLSession.shared.dataTask(with: url){ (data, response, error) in
            
            if let response = response {
                print(response)
            }
            
            do{
                var totals = try JSONDecoder().decode(APITotal.self, from: data!)
                
                //let jsonResponse = try JSONSerialization.jsonObject(with:
                //    data!, options: [])
                //print(jsonResponse) //Response result
                
                print(totals)
                
                DispatchQueue.main.async(){
                    print("Aca llego")
                    
                    let contexto = Conexion().contexto()
                    let entityInstitute = NSEntityDescription.insertNewObject(forEntityName: "MInstitute", into: contexto) as! MInstitute
                    
                    
                    
                    let institutes = totals.institutes
                    var questions  = totals.questions
                    
                    for institu in institutes
                    {
                        
                        do{
                            
                            var fetchRequest: NSFetchRequest<MInstitute> = MInstitute.fetchRequest()
                            
                            let id =  institu.id
                            fetchRequest.predicate = NSPredicate(format: "id == %ld", id as CVarArg)
                            
                            let resultado = try contexto.fetch(fetchRequest)
                            
                            if resultado.count > 0{
                                
                                print("Ya existe")
                                let institutoEditar = resultado.first
                                /*
                                 institutoEditar!.active = institu.active
                                 institutoEditar!.name   = institu.name
                                 institutoEditar!.code   = institu.code*/
                                
                                institutoEditar!.setValue(institu.active, forKey: "active")
                                institutoEditar!.setValue(institu.name, forKey: "name")
                                institutoEditar!.setValue(institu.code, forKey: "code")
                                
                                do{
                                    try contexto.save()
                                    print("guardo Editar")
                                    let aulas  = institu.aulas
                                    for aula in aulas{
                                        self.guardarAulas(aula: aula, entidad: entityInstitute)
                                    }
                                }catch let error as NSError{
                                    print("hubo un error al guardar nota", error.localizedDescription)
                                }
                                
                                
                            }else{
                                
                                let entityInstitute = NSEntityDescription.insertNewObject(forEntityName: "MInstitute", into: contexto) as! MInstitute
                                
                                entityInstitute.active = institu.active
                                entityInstitute.name   = institu.name
                                entityInstitute.code   = institu.code
                                entityInstitute.id     = Int64(institu.id)
                                
                                
                                do{
                                    try contexto.save()
                                    print("guardo")
                                    let aulas  = institu.aulas
                                    
                                    for aula in aulas{
                                        self.guardarAulas(aula: aula, entidad: entityInstitute)
                                    }
                                }catch let error as NSError{
                                    print("hubo un error al guardar nota", error.localizedDescription)
                                }
                            }
                            
                        }catch let error as NSError{
                            print("error al buscar instituto", error.localizedDescription)
                        }
                        
                        
                    }
                    
                    
                    for question in questions
                    {
                        
                        do{
                            
                            let fetchRequest: NSFetchRequest<MQuestion> = MQuestion.fetchRequest()
                            
                            let id =  question.id
                            fetchRequest.predicate = NSPredicate(format: "id == %ld", id as CVarArg)
                            
                            let resultado = try contexto.fetch(fetchRequest)
                            
                            print("Cantidad resultado Preguntas \(resultado.count) para id \(id)")
                            
                            if resultado.count > 0{
                                
                                print("Ya existe")
                                let questionEditar = resultado.first
                                
                                let urlStringPhoto = question.photo
                                
                                guard let urls = URL(string: urlStringPhoto!) else { return }
                                
                                if let datan = try? Data(contentsOf: urls) {
                                    if let imagen = UIImage(data: datan) {
                                        
                                        
                                        /*  questionEditar!.active   = question.active
                                         questionEditar!.descrip  = question.description
                                         questionEditar!.photo    = imagen.pngData()
                                         questionEditar!.maxpoint = Float(question.max_point)!
                                         questionEditar!.endtime  = question.end_time
                                         questionEditar!.type_question = Int16(question.type_question)*/
                                        
                                        
                                        
                                        questionEditar!.setValue(question.active, forKey: "active")
                                        questionEditar!.setValue(question.description, forKey: "descrip")
                                        questionEditar!.setValue(imagen.pngData(), forKey: "photo")
                                        
                                        questionEditar!.setValue(Int16(question.range_age), forKey: "range_age")
                                        questionEditar!.setValue(Float(question.max_point)!, forKey: "maxpoint")
                                        questionEditar!.setValue(question.end_time, forKey: "endtime")
                                        questionEditar!.setValue(Int16(question.type_question), forKey: "type_question")
                                        
                                        
                                        do{
                                            try contexto.save()
                                            print("guardo Editar Pregunta")
                                            let opciones  = question.options
                                            for op in opciones{
                                                self.guardarOpciones(option: op, entidad: questionEditar!)
                                            }
                                            
                                        }catch let error as NSError{
                                            print("hubo un error al guardar nota", error.localizedDescription)
                                        }
                                        
                                        
                                    }
                                }
                                
                                
                                
                            }else{
                                
                                let entityQuestion = NSEntityDescription.insertNewObject(forEntityName: "MQuestion", into: contexto) as! MQuestion
                                
                                let urlStringPhoto = question.photo
                                
                                guard let urls = URL(string: urlStringPhoto!) else { return }
                                
                                if let datan = try? Data(contentsOf: urls) {
                                    if let imagen = UIImage(data: datan) {
                                        entityQuestion.id       = Int64(question.id)
                                        entityQuestion.active   = question.active
                                        entityQuestion.descrip  = question.description
                                        entityQuestion.photo    = imagen.pngData()
                                        entityQuestion.maxpoint = Float(question.max_point)!
                                        entityQuestion.endtime  = question.end_time
                                        entityQuestion.type_question = Int16(question.type_question)
                                        entityQuestion.range_age = Int16(question.range_age)
                                        
                                        do{
                                            try contexto.save()
                                            print("guardo Pregunta")
                                            
                                            //Guardar Opciones
                                            let opciones  = question.options
                                            
                                            for op in opciones{
                                                self.guardarOpciones(option: op, entidad: entityQuestion)
                                            }
                                        }catch let error as NSError{
                                            print("hubo un error al guardar nota", error.localizedDescription)
                                        }
                                        
                                    }
                                }
                                
                            }
                            
                            activityIndicator.stopAnimating()
                            self.botonSpanish.isHidden = false
                            self.botonEureska.isHidden = false
                            
                            self.etiquetaHola.isHidden = false
                            self.etiquetaaKaixo.isHidden = false
                            
                        }catch let error as NSError{
                            print("error al buscar instituto", error.localizedDescription)
                        }
                        
                    }
                    
                }
                
                
            }catch let error as NSError{
                print("no carga el json ", error.localizedDescription)
            }
            }.resume()
    }
    
    func deleteData(){
        
        let contexto = Conexion().contexto()
        let fetchRequest: NSFetchRequest<MQuestion> = MQuestion.fetchRequest()
        
        
        do{
            let objetos = try contexto.fetch(fetchRequest)
            for objecto in objetos {
                contexto.delete(objecto)
            }
            
            let fetchRequest2: NSFetchRequest<MOption> = MOption.fetchRequest()
            
            let objetos2 = try contexto.fetch(fetchRequest2)
            for objecto in objetos2 {
                contexto.delete(objecto)
            }
        }catch{
            print(error)
        }

    }
    
    
    func guardarAulas(aula: APIAulas, entidad: MInstitute)
    {
        let contexto = Conexion().contexto()
        let id =  aula.id
        let fetchRequest: NSFetchRequest<MAula> = MAula.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %ld", id as CVarArg)
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count > 0{
                
                print("Ya existe Aula")
                let aulaEditar = resultado.first
                
                /* aulaEditar!.active     = aula.active
                 aulaEditar!.code       = aula.code
                 aulaEditar!.instituto  = entidad.id
                 aulaEditar!.name       = aula.name*/
                
                aulaEditar!.setValue(aula.active, forKey: "active")
                aulaEditar!.setValue(aula.code, forKey: "code")
                aulaEditar!.setValue(entidad.id, forKey: "instituto")
                aulaEditar!.setValue(aula.name, forKey: "name")
                
                
                do{
                    try contexto.save()
                    print("guardo Editar Aula")
                    let alumnos  = aula.students
                    for alu in alumnos{
                        self.guardarAlumnos(alumno: alu, entidad: aulaEditar!)
                    }
                }catch let error as NSError{
                    print("hubo un error al editar Aula", error.localizedDescription)
                }
                
                
                
            }else{
                
                let entityAula = NSEntityDescription.insertNewObject(forEntityName: "MAula", into: contexto) as! MAula
                
                entityAula.active     = aula.active
                entityAula.code       = aula.code
                entityAula.instituto  = entidad.id
                entityAula.name       = aula.name
                entityAula.id         = Int64(aula.id)
                
                do{
                    try contexto.save()
                    print("guardo Aula")
                    let alumnos  = aula.students
                    for alu in alumnos{
                        self.guardarAlumnos(alumno: alu, entidad: entityAula)
                    }
                }catch let error as NSError{
                    print("hubo un error al guardar opcion", error.localizedDescription)
                }
                
                
            }
        }catch let error as NSError{
            print("error al buscar la opcion", error.localizedDescription)
        }
        
    }
    
    func guardarAlumnos(alumno: APIStudent, entidad: MAula )
    {
        let contexto = Conexion().contexto()
        let id = alumno.id
        let fetchRequest: NSFetchRequest<MStudent> = MStudent.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %ld", id as CVarArg)
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count > 0{
                
                print("Ya existe Estudiante")
                let estudianteEditar = resultado.first
                
                let urlStringPhoto = alumno.photo
                
                guard let urls = URL(string: urlStringPhoto) else { return }
                
                if let datan = try? Data(contentsOf: urls) {
                    if let imagen = UIImage(data: datan) {
                        
                        
                        estudianteEditar!.setValue(entidad.id, forKey: "aula")
                        estudianteEditar!.setValue(alumno.name, forKey: "name")
                        var dateFormatter : DateFormatter = {
                            let formatter = DateFormatter()
                            formatter.dateFormat = "yyyy-MM-dd"
                            formatter.locale = Locale(identifier: "en_US_POSIX")
                            return formatter
                        }()
                        
                        let birthday = dateFormatter.date(from: alumno.birth_date)
                        estudianteEditar!.setValue(birthday, forKey: "birth_date")
                        estudianteEditar!.setValue(imagen.pngData(), forKey: "photo")
                        
                        do{
                            try contexto.save()
                            print("guardo Editar Estudiante")
                        }catch let error as NSError{
                            print("hubo un error al editar opcion", error.localizedDescription)
                        }
                        
                    }
                }
                
                
            }else{
                
                
                let urlStringPhoto = alumno.photo
                let entityEstudiante = NSEntityDescription.insertNewObject(forEntityName: "MStudent", into: contexto) as! MStudent
                
                guard let urls = URL(string: urlStringPhoto) else { return }
                
                if let datan = try? Data(contentsOf: urls) {
                    if let imagen = UIImage(data: datan) {
                        
                        entityEstudiante.aula   = entidad.id
                        entityEstudiante.name   = alumno.name
                        entityEstudiante.photo  = imagen.pngData()
                        var dateFormatter : DateFormatter = {
                            let formatter = DateFormatter()
                            formatter.dateFormat = "yyyy-MM-dd"
                            formatter.locale = Locale(identifier: "en_US_POSIX")
                            return formatter
                        }()
                        
                        let birthday = dateFormatter.date(from: alumno.birth_date)
                        entityEstudiante.birth_date = birthday
                        entityEstudiante.id     = Int64(alumno.id)
                        
                        
                        do{
                            try contexto.save()
                            print("guardo Estudiante")
                        }catch let error as NSError{
                            print("hubo un error al guardar opcion", error.localizedDescription)
                        }
                        
                    }
                }
                
            }
        }catch let error as NSError{
            print("error al buscar la opcion", error.localizedDescription)
        }
        
    }
    
    
    func guardarOpciones(option: APIOptions, entidad: MQuestion)
    {
        let contexto = Conexion().contexto()
        let id =  option.id
        let fetchRequest: NSFetchRequest<MOption> = MOption.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "id == %ld", id as CVarArg)
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count > 0{
                
                print("Ya existe Opcion")
                let optionEditar = resultado.first
                
                let urlStringPhoto = option.photo
                
                guard let urls = URL(string: urlStringPhoto) else { return }
                
                if let datan = try? Data(contentsOf: urls) {
                    if let imagen = UIImage(data: datan) {
                        
                        /* optionEditar!.correct  = option.correct
                         optionEditar!.descrip  = option.description
                         optionEditar!.photo    = imagen.pngData()
                         optionEditar!.question = entidad.id*/
                        
                        optionEditar!.setValue(option.correct, forKey: "correct")
                        optionEditar!.setValue(option.description, forKey: "descrip")
                        optionEditar!.setValue(imagen.pngData(), forKey: "photo")
                        optionEditar!.setValue(entidad.id, forKey: "question")
                        
                        
                        do{
                            try contexto.save()
                            print("guardo Editar Opcion")
                        }catch let error as NSError{
                            print("hubo un error al editar opcion", error.localizedDescription)
                        }
                        
                    }
                }
                
                
                
            }else{
                
                
                let urlStringPhoto = option.photo
                let entityOpciones = NSEntityDescription.insertNewObject(forEntityName: "MOption", into: contexto) as! MOption
                
                guard let urls = URL(string: urlStringPhoto) else { return }
                
                if let datan = try? Data(contentsOf: urls) {
                    if let imagen = UIImage(data: datan) {
                        
                        entityOpciones.id       = Int64(option.id)
                        entityOpciones.correct  = option.correct
                        entityOpciones.descrip  = option.description
                        entityOpciones.photo    = imagen.pngData()
                        entityOpciones.question = entidad.id
                        //notas.mutableSetValue(forKey: "relationToImagenes").add(entityImagenes)
                        //entidad.mutableSetValue(forKey: "relationoption").add(entityOpciones)
                        do{
                            try contexto.save()
                            print("guardo Opcion")
                        }catch let error as NSError{
                            print("hubo un error al guardar opcion", error.localizedDescription)
                        }
                        
                    }
                }
                
            }
        }catch let error as NSError{
            print("error al buscar la opcion", error.localizedDescription)
        }
        
    }
    
}

