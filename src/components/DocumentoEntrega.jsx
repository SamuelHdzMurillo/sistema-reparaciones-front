import React from 'react';

function DocumentoEntrega({ reparacion, actualizaciones }) {
  const fechaActual = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();

  const fechaActualCorta = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const numeroOrden = `${reparacion?.id || 'N/A'}/${new Date().getFullYear().toString().slice(-2)}`;

  // Obtener la última actualización que tenga descripción del trabajo realizado
  const ultimaActualizacion = actualizaciones && actualizaciones.length > 0 
    ? actualizaciones[actualizaciones.length - 1] 
    : null;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoText}>LOGO</span>
          </div>
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.institution}>
            COLEGIOS DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS
            <br />
            DEL ESTADO DE B.C.S.
            <br />
            DEPARTAMENTO DE INFORMÁTICA
          </div>
        </div>
      </div>

      <div style={styles.documentInfo}>
        <div style={styles.dateSection}>
          <strong>FECHA:</strong> {fechaActual}
        </div>
        <div style={styles.orderSection}>
          <strong>ORDEN DE SERVICIO No.:</strong> {numeroOrden}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>DATOS DEL EQUIPO</div>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.labelCell}><strong>Plantel / Usuario:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.plantel || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Tipo de Equipo:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.tipo_bien || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Marca:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.marca || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Modelo:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.modelo || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>No. Serie:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.numero_serie || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>No. Inventario:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.numero_inventario || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Entidad:</strong></td>
              <td style={styles.valueCell}>{reparacion?.bien?.entidad || 'N/A'}</td>
            </tr>
            {reparacion?.bien?.especificaciones && (
              <tr>
                <td style={styles.labelCell}><strong>Especificaciones:</strong></td>
                <td style={styles.valueCell}>{reparacion.bien.especificaciones}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>ÓRDEN DE SERVICIO</div>
        <table style={styles.table}>
          <tbody>
            <tr>
              <td style={styles.labelCell}><strong>Descripción del Problema:</strong></td>
              <td style={styles.valueCell}>{reparacion?.falla_reportada || 'N/A'}</td>
            </tr>
            <tr>
              <td style={styles.labelCell}><strong>Tipo de Mantenimiento:</strong></td>
              <td style={styles.valueCell}>Reparación</td>
            </tr>
          </tbody>
        </table>
      </div>

      {ultimaActualizacion && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>TRABAJO REALIZADO - DESCRIPCIÓN</div>
          <div style={styles.descriptionBox}>
            {ultimaActualizacion.descripcion || 'Reparación completada exitosamente.'}
          </div>
        </div>
      )}

      {reparacion?.accesorios_incluidos && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>ACCESORIOS INCLUIDOS</div>
          <div style={styles.descriptionBox}>
            {reparacion.accesorios_incluidos}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionTitle}>OBSERVACIONES</div>
        <div style={styles.observationsBox}>
          <table style={styles.observationsTable}>
            <thead>
              <tr>
                <th style={styles.obsHeader}>Equipo</th>
                <th style={styles.obsHeader}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.obsCell}>
                  {reparacion?.bien?.marca} {reparacion?.bien?.modelo}
                  <br />
                  <span style={styles.serialText}>Serie: {reparacion?.bien?.numero_serie || 'N/A'}</span>
                </td>
                <td style={styles.obsCell}>
                  {reparacion?.accesorios_incluidos ? 'Equipo Completo' : 'Sin observaciones'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.signaturesSection}>
        <div style={styles.signatureBox}>
          <div style={styles.signatureLine}></div>
          <div style={styles.signatureLabel}>
            <strong>TÉCNICO</strong>
            <br />
            {reparacion?.tecnico?.nombre || 'N/A'}
            <br />
            {reparacion?.tecnico?.numero || ''}
          </div>
        </div>
        <div style={styles.signatureBox}>
          <div style={styles.signatureLine}></div>
          <div style={styles.signatureLabel}>
            <strong>RECIBE</strong>
            <br />
            {reparacion?.cliente?.nombre_completo || 'N/A'}
            <br />
            {reparacion?.cliente?.telefono || ''}
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <div style={styles.footerSection}>
          <div><strong>Jefe de Área de Inventario:</strong></div>
          <div style={styles.footerLine}></div>
        </div>
        <div style={styles.footerSection}>
          <div><strong>Verificado por:</strong></div>
          <div style={styles.footerLine}></div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    padding: '20mm',
    backgroundColor: '#fff',
    fontFamily: 'Arial, sans-serif',
    fontSize: '11pt',
    lineHeight: '1.4',
    color: '#000',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #000',
    paddingBottom: '15px',
  },
  logoContainer: {
    width: '80px',
    height: '80px',
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    border: '2px dashed #666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logoText: {
    fontSize: '10pt',
    color: '#999',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    textAlign: 'center',
  },
  institution: {
    fontSize: '12pt',
    fontWeight: 'bold',
    lineHeight: '1.5',
    textTransform: 'uppercase',
  },
  documentInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    fontSize: '11pt',
  },
  dateSection: {
    flex: 1,
  },
  orderSection: {
    flex: 1,
    textAlign: 'right',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '8px 12px',
    fontWeight: 'bold',
    fontSize: '11pt',
    marginBottom: '10px',
    textTransform: 'uppercase',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
  },
  labelCell: {
    width: '35%',
    padding: '8px',
    border: '1px solid #000',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  valueCell: {
    width: '65%',
    padding: '8px',
    border: '1px solid #000',
  },
  descriptionBox: {
    border: '1px solid #000',
    padding: '15px',
    minHeight: '80px',
    textAlign: 'justify',
    backgroundColor: '#fafafa',
  },
  observationsBox: {
    border: '1px solid #000',
    padding: '10px',
  },
  observationsTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  obsHeader: {
    border: '1px solid #000',
    padding: '8px',
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  obsCell: {
    border: '1px solid #000',
    padding: '8px',
    verticalAlign: 'top',
  },
  serialText: {
    fontSize: '9pt',
    color: '#666',
    fontStyle: 'italic',
  },
  signaturesSection: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '40px',
    marginBottom: '30px',
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: '1px solid #000',
    marginBottom: '10px',
    height: '60px',
  },
  signatureLabel: {
    fontSize: '10pt',
    lineHeight: '1.6',
  },
  footer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '10pt',
  },
  footerSection: {
    width: '45%',
  },
  footerLine: {
    borderTop: '1px solid #000',
    marginTop: '5px',
    height: '40px',
  },
};

export default DocumentoEntrega;
