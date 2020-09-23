//
//  Conexion.swift
//  ThinkShareDefinitivo
//
//  Created by Jose Flores on 6/17/19.
//  Copyright © 2019 dlofer. All rights reserved.
//

import Foundation
import CoreData
import UIKit

class Conexion{
    func contexto()->NSManagedObjectContext{
        let delegate = UIApplication.shared.delegate as! AppDelegate
        return delegate.persistentContainer.viewContext
    }
}
