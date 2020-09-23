//
//  opcionalViewController.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 5/30/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import UIKit
import CoreData


class opcionalViewController: UIViewController {
    
    @IBOutlet weak var textPregunta: UILabel!
    
    @IBOutlet var Opciones: [UIImageView]!
    
    @IBOutlet var vidasArray: [UIImageView]!
    
    
    var quest: APIQuestion?
    var questOption: MQuestion!
    var optiones    =  [MOption]()
    var questionsM = [MQuestion]()
    var edadseleccionada = 0
    
    var server = "http://142.93.52.189"

    override func viewDidLoad() {
        super.viewDidLoad()
        textPregunta.text = self.questOption!.descrip
        esconderOpciones()
        buscarOpcionesN()
        self.cantidadVidas()
        //textPregunta.text = quest?.description
        
        // Do any additional setup after loading the view.
    }
    
    
    
    func esconderOpciones(){
        for op in Opciones {
            op.isHidden = true
        }
    }
    
    func buscarOpcionesN(){
        
        let fetchRequest: NSFetchRequest<MOption> = MOption.fetchRequest()
        let contexto = Conexion().contexto()
        let id =  self.questOption.id
        fetchRequest.predicate = NSPredicate(format: "question == %ld", id as CVarArg)
        
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            print("\(resultado.count) hhkkkk")
            if resultado.count > 0{
                self.optiones = resultado
                
                print(self.optiones)
                print("8888888")
                mostrarOpciones()
            }
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        
    }
    
    func cantidadVidas()
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
                self.mostrarVidas(cantidad: vidas!.numero)
                return
            }
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        
        
        print("Entro 2 ")
        
        self.mostrarVidas(cantidad: 0)
    }
    
    func restarCantidadVidas() -> Int64
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
                let vidaNro = vidas!.numero - 1
                
                if(vidaNro>=0){
                    
                    vidas!.setValue(vidaNro, forKey: "numero")
                    
                    do{
                        try contexto.save()
                        self.mostrarVidas(cantidad: vidaNro)
                        print("guardo Editar Vida")
                        
                        return vidaNro
                    }catch let error as NSError{
                        print("hubo un error al editar vidas", error.localizedDescription)
                    }
                    
                }
                
            }
        }catch let error as NSError{
            print("Error en Buscar Preguntas ", error.localizedDescription)
        }
        
        return 0
    }
    
    
    func guardarRespuesta(que: Int64)
    {
        let contexto = Conexion().contexto()
        
        
        do{
            
            var fetchRequest: NSFetchRequest<MStorage> = MStorage.fetchRequest()
            
            let invitado =  0
            let nivel = 1
            fetchRequest.predicate = NSPredicate(format: "student == %ld AND nivel == %ld AND question == %ld", invitado as CVarArg, nivel as CVarArg, que as CVarArg )
            
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count == 0 {
                
                let entityStorage = NSEntityDescription.insertNewObject(forEntityName: "MStorage", into: contexto) as! MStorage
                
                entityStorage.question = que
                entityStorage.student  = Int64(invitado)
                entityStorage.nivel    = 1
                
                
                do{
                    try contexto.save()
                    print("***********")
                    print("***********")
                    print("***********")
                    print("***********")
                    
                    print("guardo")
                    
                    print("***********")
                    print("***********")
                    print("***********")
                }catch let error as NSError{
                    print("hubo un error al guardar respuesta", error.localizedDescription)
                }
                
            }
            
        }catch let error as NSError{
            print("error Vidas", error.localizedDescription)
        }
        
    }
    
    
    func buscarPreguntasN(){
        
        
        let fetchRequest: NSFetchRequest<MQuestion> = MQuestion.fetchRequest()
        let contexto = Conexion().contexto()
        let id =  self.questOption!.id
        print("IDDIDIDIDIDIDIDI")
        print(id)
        print(self.edadseleccionada)
        print("IDJDJDJDJDJDJJDJD")
        fetchRequest.predicate = NSPredicate(format: "id > %ld AND range_age == %ld", id as CVarArg, self.edadseleccionada as CVarArg)
        fetchRequest.sortDescriptors = [NSSortDescriptor(key: "id", ascending: true)]
        
        
        do{
            let resultado = try contexto.fetch(fetchRequest)
            
            if resultado.count > 0{
                
                self.questionsM = resultado
                
                let type_question = resultado.first?.type_question
                
                print(resultado.first)
                
                print("tipe question", type_question)
                print(resultado.first)
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
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        
        if segue.identifier  == "opcionalSegue" {
            let destino = segue.destination as! opcionalViewController
            //destino.quest = self.questions[0]
            destino.questOption = self.questionsM.first
            destino.edadseleccionada = edadseleccionada
        }
        
        if segue.identifier == "questionSegue" {
            let destino = segue.destination as! QuestionViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = edadseleccionada
        }
        
        if segue.identifier == "completeSegue"{
            
            let destino = segue.destination as! CompleteViewController
            //destino.quest = self.questions[0]
            destino.quest = self.questionsM.first
            destino.edadseleccionada = edadseleccionada
            
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
    
    func mostrarVidas(cantidad: Int64){
        
        if cantidad == 0 {
            
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
            
        }
        /*for vida in vidasArray {
            
            if op.tag < self.vidasArray.count  {
                let optionselect = self.optiones[op.tag]
                
                let datan = optionselect.photo
                if let imagen = UIImage(data: datan!) {
                    op.image = imagen
                }
                
                op.isHidden = false
            }
        }*/
    }
    
    
    func mostrarOpciones(){
        let tapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(imageTapped(tapGestureRecognizer:)))
        
        let tapGestureRecognizer2 = UITapGestureRecognizer(target: self, action: #selector(imageTapped(tapGestureRecognizer:)))
        
        
        let tapGestureRecognizer3 = UITapGestureRecognizer(target: self, action: #selector(imageTapped(tapGestureRecognizer:)))
        
        let tapGestureRecognizer4 = UITapGestureRecognizer(target: self, action: #selector(imageTapped(tapGestureRecognizer:)))
        
        let tapGestureRecognizer5 = UITapGestureRecognizer(target: self, action: #selector(imageTapped(tapGestureRecognizer:)))
        
      //  let i = 0
        Opciones[0].isUserInteractionEnabled = true
        Opciones[0].addGestureRecognizer(tapGestureRecognizer)
        
        
        Opciones[1].isUserInteractionEnabled = true
        Opciones[1].addGestureRecognizer(tapGestureRecognizer2)
        
        Opciones[2].isUserInteractionEnabled = true
        Opciones[2].addGestureRecognizer(tapGestureRecognizer3)
        
        Opciones[3].isUserInteractionEnabled = true
        Opciones[3].addGestureRecognizer(tapGestureRecognizer4)
        
        Opciones[4].isUserInteractionEnabled = true
        Opciones[4].addGestureRecognizer(tapGestureRecognizer5)
        
        
        for op in Opciones {
            
            //op.isUserInteractionEnabled = true
            //op.addGestureRecognizer(tapGestureRecognizer)
            
            
            if op.tag < self.optiones.count  {
                let optionselect = self.optiones[op.tag]
                
                let datan = optionselect.photo
                if let imagen = UIImage(data: datan!) {
                    op.image = imagen
                }
                
                op.isHidden = false
            }
            
        }
        
        /*for op in Opciones {
            
            let questionselect = quest?.options[op.tag]
                
            if let urlStringPhoto = Optional(questionselect?.photo){
                
                    let urlDef = "\(server)\(urlStringPhoto!)"
                    
                    guard let urls = URL(string: urlDef) else { return }
                    
                    if let datan = try? Data(contentsOf: urls) {
                        if let imagen = UIImage(data: datan) {
                            op.image = imagen
                        }
                    }
            }
            
        }*/
       
    }
    
    @objc func imageTapped(tapGestureRecognizer: UITapGestureRecognizer)
    {
        let tappedImage = tapGestureRecognizer.view as! UIImageView
        let respuesta = self.optiones[tappedImage.tag]
        
        
        if(respuesta.correct)
        {
            
            self.guardarRespuesta(que: respuesta.id)
            self.buscarPreguntasN()
        }else{
            let vidasRestantes = self.restarCantidadVidas()
            
            if(vidasRestantes==0)
            {
                performSegue(withIdentifier: "nivelSegue", sender: self)
            }
            
        }
        
        
        // Your action
    }
    
    
    @IBAction func salirBtn(_ sender: UIButton) {
      UIControl().sendAction(#selector(NSXPCConnection.suspend), to: UIApplication.shared, for: nil)
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
