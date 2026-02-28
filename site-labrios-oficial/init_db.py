import os
from app import app, db, User, LabSettings

def force_init():
    with app.app_context():
        db.drop_all()
        db.create_all()
        
        admin = User(username="jovitoadm2026", password="lab2026rios")
        db.session.add(admin)
        
        settings = LabSettings(
            lab_name="LABORATÓRIO DE ANÁLISE DE ÁGUA DO MÉDIO AMAZONAS – LABRIOS/CESP",
            hero_text="Esta é a interface multiusuário oficial do laboratório...",
            external_form_link="https://forms.google.com"
        )
        db.session.add(settings)
        db.session.commit()
        print("Banco reiniciado com sucesso!")

if __name__ == "__main__":
    force_init()
