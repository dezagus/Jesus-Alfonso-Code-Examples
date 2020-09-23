//
//  edadViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 5/30/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import CoreData

class edadViewController: UIViewController {

    @IBOutlet weak var boton6a8: UIButton!
    @IBOutlet weak var boton8a10: UIButton!
    @IBOutlet weak var boton10a12: UIButton!
    @IBOutlet weak var contenedor: UIView!
    @IBOutlet weak var boton4a6: UIButton!
    var seleccionarEdad:Bool = false
    var questionsM = [MQuestion]()
    var edadseleccionada = 0
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        self.contenedor.layer.cornerRadius = 15.0
        self.boton6a8.layer.cornerRadius = 15.0
        self.boton8a10.layer.cornerRadius = 15.0
        self.boton10a12.layer.cornerRadius = 15.0
        self.boton4a6.layer.cornerRadius = 15.0
    }
    
    @IBAction func seleccionEdad(_ sender: UIButton) {
        
        switch sender.tag {
            
        case 1:
           boton4a6.layer.opacity = 0.5
           boton6a8.layer.opacity = 1
           boton8a10.layer.opacity = 1
           boton10a12.layer.opacity = 1
           seleccionarEdad = true
           edadseleccionada = 1
        case 2:
           boton6a8.layer.opacity = 0.5
           boton4a6.layer.opacity = 1
           boton8a10.layer.opacity = 1
           boton10a12.layer.opacity = 1
           seleccionarEdad = true
           edadseleccionada = 2
        case 3:
           boton8a10.layer.opacity = 0.5
           boton4a6.layer.opacity = 1
           boton6a8.layer.opacity = 1
           boton10a12.layer.opacity = 1
           seleccionarEdad = true
           edadseleccionada = 3
        case 4:
            boton10a12.layer.opacity = 0.5
            boton4a6.layer.opacity = 1
            boton6a8.layer.opacity = 1
            boton8a10.layer.opacity = 1
            seleccionarEdad = true
            edadseleccionada = 4
        default:
            boton4a6.layer.opacity = 1
            boton6a8.layer.opacity = 1
            boton8a10.layer.opacity = 1
            boton10a12.layer.opacity = 1
            edadseleccionada = 0
            
        }
    }
    
    func seleccionBoton(){
        
        print(seleccionarEdad)
        
        if seleccionarEdad == false {
            let alert = UIAlertController(title: "Debe Seleccionar una Edad", message: "Para avanzar debe seleccionar una Edad primero", preferredStyle: .alert)
            
            alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
            
                self.present(alert, animated: true, completion: nil)
        
        }else{
            
            performSegue(withIdentifier: "nivelSegue", sender: self)
           // self.buscarPreguntasN()
        }
        
    }
    
    func buscarPreguntasN(){
        
        let fetchRequest: NSFetchRequest<MQuestion> = MQuestion.fetchRequest()
        let contexto = Conexion().contexto()
        fetchRequest.predicate = NSPredicate(format: "id != 0 AND range_age == %ld", edadseleccionada as CVarArg)
        fetchRequest.sortDescriptors = [NSSortDescriptor(key: "id", ascending: true)]
        
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            for result in resultado {
                let type_question = result.id
                print("dsdsdasdsadasd ENTROOOOOO")
                print("\(type_question)")
                print("dsdsdasdsadasd ENTROOOOOO")
            }
            
            if resultado.count > 0{
                
                self.questionsM = resultado
                
                let type_question = resultado.first?.type_question
                
                print("++++++++++++++++++++++++++++++")
                print("Cantidad")
                print(resultado.count)
                
                print("++++++++++++++++++++++++++++++")
                print("tipe question", type_question)
                print(resultado.first)
                print("++++++++++++++++++++++++++++++")
                self.irPreguntas(tipoPregunta: type_question!)
            }else{
                
                let alert = UIAlertController(title: "No existen Preguntas registradas", message: "Para la edad seleccionada", preferredStyle: .alert)
                
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                
                self.present(alert, animated: true, completion: nil)
            
            }
            
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        
    }
    
    
    func irPreguntas(tipoPregunta: Int16)
    {
        
        switch tipoPregunta {
        case 1:
            performSegue(withIdentifier: "opcionalSegue", sender: self)
        case 2:
            performSegue(withIdentifier: "questionSegue", sender: self)
        case 3:
            performSegue(withIdentifier: "completeSegue", sender: self)
        default:
            performSegue(withIdentifier: "questionSegue", sender: self)
        }
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier  == "opcionalSegue" {
            let destino = segue.destination as! opcionalViewController
            //destino.quest = self.questions[0]
            destino.questOption = self.questionsM.first
            destino.edadseleccionada = self.edadseleccionada
            
        }
        
        if segue.identifier == "questionSegue" {
            let destino = segue.destination as! QuestionViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = self.edadseleccionada
        }
        
        if segue.identifier == "completeSegue"{
            
            let destino = segue.destination as! CompleteViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = self.edadseleccionada
            
        }
    }
    
    
    @IBAction func avanzar(_ sender: UIButton) {
        seleccionBoton()
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
