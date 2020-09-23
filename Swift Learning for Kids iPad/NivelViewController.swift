//
//  NivelViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 8/28/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import CoreData

class NivelViewController: UIViewController {
    
    var seleccionarEdad:Bool = false
    var questionsM = [MQuestion]()
    var edadseleccionada = 1

    @IBOutlet var nivelesArray: [UIButton]!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.establecerNivel()
        self.establecerVidas()
        self.ocultarNiveles()
        self.NivelActual()
        // Do any additional setup after loading the view.
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
    
    func establecerNivel()
    {
        let contexto = Conexion().contexto()
        
        
        do{
            
            var fetchRequest: NSFetchRequest<MNivel> = MNivel.fetchRequest()
            
            let invitado =  0
            fetchRequest.predicate = NSPredicate(format: "student == %ld", invitado as CVarArg)
            
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count == 0 {
                
                let entityNivel = NSEntityDescription.insertNewObject(forEntityName: "MNivel", into: contexto) as! MNivel
                
                entityNivel.numero   = 1
                entityNivel.student  = 0
                
                
                do{
                    try contexto.save()
                    print("guardo")
                }catch let error as NSError{
                    print("hubo un error al guardar nivel", error.localizedDescription)
                }
            }else{
                print("NIVEL NIVEL NIVEL")
            }
            
        }catch let error as NSError{
            print("error Nivel", error.localizedDescription)
        }
        
    }
    
    func establecerVidas()
    {
        let contexto = Conexion().contexto()
        
        
        do{
            
            var fetchRequest: NSFetchRequest<MLife> = MLife.fetchRequest()
            
            let invitado =  0
            fetchRequest.predicate = NSPredicate(format: "student == %ld", invitado as CVarArg)
            
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count == 0 {
                
                let entityLife = NSEntityDescription.insertNewObject(forEntityName: "MLife", into: contexto) as! MLife
                
                entityLife.numero   = 3
                entityLife.student  = 0
                
                
                do{
                    try contexto.save()
                    print("guardo")
                }catch let error as NSError{
                    print("hubo un error al guardar vida", error.localizedDescription)
                }
                
            }else{
                let vida = resultado.first
                
                if(vida!.numero==0)
                {
                    self.resetearVidas()
                }
            }
            
        }catch let error as NSError{
            print("error Vidas", error.localizedDescription)
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
    
    
    func NivelActual()
    {
        let fetchRequest: NSFetchRequest<MNivel> = MNivel.fetchRequest()
        let contexto = Conexion().contexto()
        let invitado = 0;
        
        fetchRequest.predicate = NSPredicate(format: "student == %ld ", invitado as CVarArg)
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            if resultado.count > 0{
                print("Entro 1 ")
                let nivelActual = resultado.first
                self.mostrarNivel(nivelActual: nivelActual!.numero)
                return
            }
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        
        
        print("Entro 2 ")
        
        self.mostrarNivel(nivelActual: 1)
    }
    
    func ocultarNiveles()
    {
        for nivel in self.nivelesArray {
            //nivel.isHidden = true;
            nivel.tintColor = UIColor.darkGray
            nivel.backgroundColor =  UIColor(red: 200/255, green: 200/255, blue: 200/255, alpha: 1)
            
            
        }
    }
    
    func mostrarNivel(nivelActual: Int64)
    {
        
        for nivel in self.nivelesArray {
            
            if(nivel.tag <= nivelActual)
            {
                
                nivel.tintColor  = UIColor.white
                nivel.backgroundColor =  UIColor(red: 0, green: 163/255, blue: 89/255, alpha: 1)
            }
        }
        
       /*if cantidad == 0 {
            
            self.vidasArray[0].image =  UIImage(named: "novida")
            self.vidasArray[1].image =  UIImage(named: "novida")
            self.vidasArray[2].image =  UIImage(named: "novida")
            
        }
        
        if cantidad ==  1 {
            
            self.vidasArray[0].image =  UIImage(named: "vida")
            self.vidasArray[1].image =  UIImage(named: "novida")
            self.vidasArray[2].image =  UIImage(named: "novida")
            
        }
        
        if cantidad  == 2{
            
            self.vidasArray[0].image =  UIImage(named: "vida")
            self.vidasArray[1].image =  UIImage(named: "vida")
            self.vidasArray[2].image =  UIImage(named: "novida")
            
        }
        
        if cantidad == 3{
            
            self.vidasArray[0].image =  UIImage(named: "vida")
            self.vidasArray[1].image =  UIImage(named: "vida")
            self.vidasArray[2].image =  UIImage(named: "vida")
            
        }*/
        
    }
    
    
    func resetearVidas()
    {
        let fetchRequest: NSFetchRequest<MLife> = MLife.fetchRequest()
        let contexto = Conexion().contexto()
        let invitado = 0;
        
        fetchRequest.predicate = NSPredicate(format: "student == %ld ", invitado as CVarArg)
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            if resultado.count > 0{
                print("Entro 1 ")
                let vidas = resultado.first
                let vidaNro = vidas?.numero
                
                if(vidaNro==0){
                    
                    vidas!.setValue(3, forKey: "numero")
                    
                    do{
                        try contexto.save()
                    }catch let error as NSError{
                        print("hubo un error al editar vidas", error.localizedDescription)
                    }
                    
                }
                
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
        self.buscarPreguntasN()
    }
    

}
