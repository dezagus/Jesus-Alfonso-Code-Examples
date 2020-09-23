//
//  AutenticacionViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 5/30/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import AVFoundation
import CoreData

struct Student: Codable{
    let id: Int
    let photo: String
    let aula: String
    let name: String
    let birth_date: String
}

class AutenticacionViewController: UIViewController {

    @IBOutlet weak var letraInicio: UILabel!
    @IBOutlet weak var imageAlumno: UIImageView!
    
    @IBOutlet weak var letrasSiguientes: UILabel!
    @IBOutlet var letras: [UIButton]!
    var player: AVAudioPlayer = AVAudioPlayer()
    var acumuladorLetras: String = ""
    var alumno: Student?
    var alumnos  = [Student]()
    var alumnosM = [MStudent]()
    var estado   = 0
    var codigoInstituto: String = ""
    var questions = [APIQuestion]()
    var questionsM = [MQuestion]()
    var edadAlumno = 0
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        letraInicio.text = "";
        letrasSiguientes.text = "";
        self.imageAlumno.isHidden = true
        self.letraInicio.isHidden = true
    }
    
    @IBAction func loguear(_ sender: UIButton) {
        buscarPreguntasN()
        
        /*if self.alumno != nil {
         
        }else{
            let alert = UIAlertController(title: "Alumno no Seleccionado", message: "Debe Seleccionar antes un Alumno para poder avanzar", preferredStyle: .alert)
            
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            
            self.present(alert, animated: true, completion: nil)
            
       // }*/
        //irPreguntas();
    }
    
    

    
    func buscarPreguntasN(){
        
        let fetchRequest: NSFetchRequest<MQuestion> = MQuestion.fetchRequest()
        let contexto = Conexion().contexto()
        //fetchRequest.predicate = NSPredicate(format: "id != 0")
        print("Edad: \(self.edadAlumno)")
        fetchRequest.predicate = NSPredicate(format: "id > 0 AND range_age == %ld", self.edadAlumno as CVarArg)
        
        do{
            self.estado = 0
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count > 0{
                
                self.questionsM = resultado
                
                let type_question = resultado.first?.type_question
                
                print(resultado.first)
                
                print("tipe question", type_question)
                print(resultado.first)
                self.irPreguntas(tipoPregunta: type_question!)
            }
            
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        

    
    }
    
    
    func buscarPreguntas(){
        guard let datos = URL(string: "http://142.93.52.189/questions/") else { return }
        let url =  URLRequest(url: datos)
        //let parametros = ["name": name]
        // url.httpMethod = "GET"
        //url.addValue("application/json", forHTTPHeaderField: "Content-type")
        
        URLSession.shared.dataTask(with: url) { (data, response, error) in
            
            if let response = response {
                print(response)
            }
            
            do{
                //self.alumno = try JSONDecoder().decode(Student.self, from: data!)
                //DispatchQueue.main.
                self.estado = 0
                print(data!)
                self.questions = try JSONDecoder().decode([APIQuestion].self, from: data!)
                
                print(self.questions)
                
                
                /*let jsonResponse = try JSONSerialization.jsonObject(with: data!, options:[])
                 
                 print(jsonResponse)
                 
                 guard let jsonArray = jsonResponse as? [[String: Any]] else {
                 return
                 }*/
                
               DispatchQueue.main.async(){
                
                if(self.questions.count>0){
                    self.irPreguntas(tipoPregunta: 1)
                }
                    
               }
                
            }catch let error as NSError{
                print("no carga el json ", error.localizedDescription)
            }
            
        }.resume()
    }
    
    @IBAction func noSoyElEstudiante(_ sender: UIButton) {
        
        self.estado += 1
        
        if self.alumnosM.count>0 {
            if self.alumnosM.count>estado
            {
                do {
                    let alumnoActual: MStudent = self.alumnosM[estado]
                    
                    if let datan = alumnoActual.photo {
                            if let imagen = UIImage(data: datan) {
                                self.imageAlumno.image = imagen
                                self.acumuladorLetras = alumnoActual.name!
                                self.actualizarNombre()
                            }
                    }
                    
                }catch let error as NSError{
                    print("El error es: ", error.localizedDescription)
                }
                
            }else{
                let alertController = UIAlertController(title: "Estudiantes No Encontrado", message: "No existen más coincidencias de Estudiantes, por favor verifique el Nombre ", preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    NSLog("Presiono OK del alert")
                }))
                
                self.present(alertController, animated: true, completion: {
                    NSLog("Presiono OK del alert II")
                })
                
                letraInicio.text      = ""
                letrasSiguientes.text = ""
                self.imageAlumno.image = nil
                self.letraInicio.isHidden = true
            }
        }
        
        /*
        if self.alumnos.count>0 {
            if self.alumnos.count>estado
            {
                do {
                  let alumnoActual: Student = self.alumnos[estado]
                  if let urlStringPhoto = Optional(alumnoActual.photo){
                        
                        guard let urls = URL(string: urlStringPhoto) else { return }
                        
                        if let datan = try? Data(contentsOf: urls) {
                            if let imagen = UIImage(data: datan) {
                                self.imageAlumno.image = imagen
                                self.acumuladorLetras = alumnoActual.name
                                self.actualizarNombre()
                            }
                        }
                  }
                }catch let error as NSError{
                    print("El error es: ", error.localizedDescription)
                }
                
            }else{
                let alertController = UIAlertController(title: "Estudiantes No Encontrado", message: "No existen más coincidencias de Estudiantes, por favor verifique el Nombre ", preferredStyle: .alert)
                alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    NSLog("Presiono OK del alert")
                }))
                
                self.present(alertController, animated: true, completion: {
                    NSLog("Presiono OK del alert II")
                })
            }
        }*/
        
    }
    @IBAction func seguirBuscando(_ sender: UIButton) {
        
    }
    @IBAction func presionarLetra(_ sender: UIButton) {
        tocarLetra()
        
       switch sender.tag {
        case 1:
        actualizarTecleo(letra: "A")
        case 2:
        actualizarTecleo(letra: "B")
        case 3:
        actualizarTecleo(letra: "C")
        case 4:
        actualizarTecleo(letra: "D")
        case 5:
        actualizarTecleo(letra: "E")
        case 6:
        actualizarTecleo(letra: "F")
        case 7:
        actualizarTecleo(letra: "G")
        case 8:
        actualizarTecleo(letra: "H")
        case 9:
        actualizarTecleo(letra: "I")
        case 10:
        actualizarTecleo(letra: "J")
        case 11:
        actualizarTecleo(letra: "K")
        case 12:
        actualizarTecleo(letra: "L")
        case 13:
        actualizarTecleo(letra: "M")
        case 14:
        actualizarTecleo(letra: "N")
        case 15:
        actualizarTecleo(letra: "Ñ")
        case 16:
        actualizarTecleo(letra: "O")
        case 17:
        actualizarTecleo(letra: "P")
        case 18:
        actualizarTecleo(letra: "Q")
        case 19:
        actualizarTecleo(letra: "R")
        case 20:
        actualizarTecleo(letra: "S")
        case 21:
        actualizarTecleo(letra: "T")
        case 22:
        actualizarTecleo(letra: "U")
        case 23:
        actualizarTecleo(letra: "V")
        case 24:
        actualizarTecleo(letra: "W")
        case 25:
        actualizarTecleo(letra: "X")
        case 26:
        actualizarTecleo(letra: "Y")
        case 27:
        actualizarTecleo(letra: "Z")
        default:
        actualizarTecleo(letra: "A")
        }
        
        
    }

    
    func getAlumnoDB(name: String)
    {
        let contexto = Conexion().contexto()
        let fetchRequest: NSFetchRequest<MStudent> = MStudent.fetchRequest()
        let orderByNombre = NSSortDescriptor(key: "name", ascending: true)
        fetchRequest.sortDescriptors = [orderByNombre]
        //fetchRequest.predicate = NSPredicate(format: "code == %@", name as CVarArg)
        fetchRequest.predicate = NSPredicate(format: "name BEGINSWITH[c] %@", name as CVarArg)
        
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            self.estado   = 0
            self.alumnosM = resultado
            
            //print("Inicia con \(resultado.first?.name)")
            
           if resultado.count > 0{
            
                let studentObj = resultado.first
            
                self.imageAlumno.isHidden = false
                self.letraInicio.isHidden = false
            
                let datan = studentObj?.photo
    
                if let imagen = UIImage(data: datan!) {
                    self.imageAlumno.image = imagen
                    self.acumuladorLetras = (studentObj?.name)!
                    self.actualizarNombre()
                }
                let birth = studentObj!.birth_date
            
            
                let formatter = DateFormatter()
                // initially set the format based on your datepicker date / server String
                formatter.dateFormat = "yyyy-MM-dd"
            
                let myString = formatter.string(from: birth!)
                print(myString)
                let fecha  = formatter.date(from: myString)
            
                //2 - get today date
                let today = Date()
            
                //3 - create an instance of the user's current calendar
                let calendar = Calendar.current
            
                //4 - use calendar to get difference between two dates
                let components = calendar.dateComponents([.year, .month, .day], from: fecha!, to: today)
            
                let ageYears = components.year
                let ageMonths = components.month
                let ageDays = components.day
  
                print(ageYears)

                self.edadAlumno = 1
            
           }else{
            
                let alert = UIAlertController(title: "Búsqueda sin coincidencias ", message: "No se encontraron Alumno para el código de Instituto que coincida", preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                
                self.present(alert, animated: true, completion: nil)
            
           }
            
        }catch let error as NSError{
            print("hubo un error al guardar nota", error.localizedDescription)
        }

        
    }

    
    
    func getAlumnoAPI(name: String){
        
        self.getAlumnoDB(name: name)
        
       /* guard let datos = URL(string: "http://142.93.52.189/searchstudent/\(self.codigoInstituto)/") else { return }
        var url =  URLRequest(url: datos)
        let parametros = ["name": name]
        url.httpMethod = "POST"
        url.addValue("application/json", forHTTPHeaderField: "Content-type")
        
        guard let body = try? JSONSerialization.data(withJSONObject: parametros, options: []) else { return }
        
        url.httpBody = body
        
        URLSession.shared.dataTask(with: url) { (data, response, error) in
            
            if let response = response {
                print(response)
            }
            
            do{
                //self.alumno = try JSONDecoder().decode(Student.self, from: data!)
                //DispatchQueue.main.
                self.estado = 0
                self.alumnos = try JSONDecoder().decode([Student].self, from: data!)
                
                print(self.alumnos)
                /*let jsonResponse = try JSONSerialization.jsonObject(with: data!, options:[])
                
                print(jsonResponse)
                
                guard let jsonArray = jsonResponse as? [[String: Any]] else {
                    return
                }*/
                
                DispatchQueue.main.async(){
                    if self.alumnos.count>0 {
                        
                        self.imageAlumno.isHidden = false
                        self.letraInicio.isHidden = false
                        
                        if let urlStringPhoto = Optional(self.alumnos[0].photo){
                            
                           guard let urls = URL(string: urlStringPhoto) else { return }
                            
                            if let datan = try? Data(contentsOf: urls) {
                                if let imagen = UIImage(data: datan) {
                                        self.imageAlumno.image = imagen
                                        self.acumuladorLetras = self.alumnos[0].name
                                        self.actualizarNombre()
                                    
                                    
                                }
                            }
                            
                            
                        
                        }
                    }
                    else{
                        let alert = UIAlertController(title: "Búsqueda sin coincidencias ", message: "No se encontraron Alumno para el código de Instituto que coincida", preferredStyle: .alert)
                        
                        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                        
                        self.present(alert, animated: true, completion: nil)
                    }
                }
                
            }catch let error as NSError{
                print("no carga el json ", error.localizedDescription)
            }
            
        }.resume()
        */
        
    }
    
    func actualizarTecleo(letra: String)
    {
        //self.acumuladorLetras.append(letra)
        self.acumuladorLetras = letra
        letraInicio.text      = String(self.acumuladorLetras.first!)
        let start = String.Index(encodedOffset: 1)
        letrasSiguientes.text = String(self.acumuladorLetras[start..<acumuladorLetras.endIndex])
        
        getAlumnoAPI(name: self.acumuladorLetras)
        
    }
    
    
    func actualizarNombre()
    {
        letraInicio.text      = String(self.acumuladorLetras.first!)
        let start = String.Index(encodedOffset: 1)
        letrasSiguientes.text = String(self.acumuladorLetras[start..<acumuladorLetras.endIndex])
    }
    
    func tocarLetra(){
        do {
            let audioPath = Bundle.main.path(forResource: "presionar", ofType: "wav")
            try player = AVAudioPlayer(contentsOf: NSURL(fileURLWithPath: audioPath!) as URL)
            player.prepareToPlay()
            player.play()
        } catch let error as NSError {
            print("Error al reproducir el sonido", error.localizedDescription)
        }
        
    }
    
    func irPreguntas(tipoPregunta: Int16)
    {
        
        switch tipoPregunta {
        case 1:
            performSegue(withIdentifier: "opcional", sender: self)
        case 2:
            performSegue(withIdentifier: "question", sender: self)
        case 3:
            performSegue(withIdentifier: "complete", sender: self)
        default:
            performSegue(withIdentifier: "question", sender: self)
        }
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        print("Edad:  \(self.edadAlumno)")
        if segue.identifier  == "opcional" {
                let destino = segue.destination as! opcionalViewController
                //destino.quest = self.questions[0]
                destino.questOption = self.questionsM.first
                destino.edadseleccionada = self.edadAlumno
        }
        
        if segue.identifier == "question" {
            let destino = segue.destination as! QuestionViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = self.edadAlumno
        }
        
        if segue.identifier == "complete"{
            
            let destino = segue.destination as! CompleteViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = self.edadAlumno
            
        }
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
