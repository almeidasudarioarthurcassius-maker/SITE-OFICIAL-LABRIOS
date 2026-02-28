import os
from app import app, db, User, LabSettings
from sqlalchemy import text

def force_init():
    with app.app_context():
        print("--- Iniciando Sincronização de Banco ---")
        # Tabelas a serem verificadas/limpas
        tables = ['reservation', 'equipment', 'member', 'rule', 'lab_settings', 'user', 'gestor_member', 'user_member']
        
        try:
            for table in tables:
                db.session.execute(text(f'DROP TABLE IF EXISTS "{table}" CASCADE;'))
            db.session.commit()
            print("1. Limpeza concluída.")
        except Exception as e:
            print(f"Erro na limpeza: {e}")
            db.session.rollback()

        # Cria a nova estrutura com todos os campos (Originais + Novos)
        db.create_all()
        print("2. Estrutura de tabelas criada.")
        
        # Usuário ADM
        if not User.query.filter_by(username="jovitoadm2026").first():
            admin = User(username="jovitoadm2026", password="lab2026rios")
            db.session.add(admin)
        
        # Configurações Iniciais
        if not LabSettings.query.first():
            settings = LabSettings(
                lab_name="LABORATÓRIO DE ANÁLISE DE ÁGUA DO MÉDIO AMAZONAS – LABRIOS/CESP",
                hero_text="Interface multiusuário oficial do laboratório.",
                external_form_link="https://forms.google.com",
                link_portaria_gestor="#",
                link_portaria_usuarios="#"
            )
            db.session.add(settings)
        
        db.session.commit()
        print("3. Dados mestres inseridos com sucesso!")

if __name__ == "__main__":
    force_init()
