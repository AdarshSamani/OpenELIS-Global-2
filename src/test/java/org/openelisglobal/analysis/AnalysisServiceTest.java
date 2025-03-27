package org.openelisglobal.analysis;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;

import java.util.List;
import java.util.UUID;

import org.junit.Before;
import org.junit.Test;
import org.openelisglobal.BaseWebContextSensitiveTest;
import org.openelisglobal.analysis.service.AnalysisService;
import org.openelisglobal.analysis.valueholder.Analysis;
// import org.openelisglobal.test.valueholder.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class AnalysisServiceTest extends BaseWebContextSensitiveTest {

    @Autowired
    private AnalysisService analysisService;

    @Before
    public void setUp() throws Exception {
        executeDataSetWithStateManagement("testdata/analysis.xml");
    }

    public void getAnalysisFromDatabase_shouldReturnAllAnalyses() {
        List<Analysis> analysisList = analysisService.getAll();
        assertEquals(2, analysisList.size());
    }

    @Test
    public void getTestDisplayName_shouldReturnCorrectTestName() {
        Analysis analysis = analysisService.get("1");
        String displayName = analysisService.getTestDisplayName(analysis);
        assertNotNull(displayName);
        assertTrue(displayName.contains("Blood Chem"));
    }

    @Test
    public void insert_shouldGenerateFhirUuidIfNotProvided() {
        Analysis newAnalysis = new Analysis();
        String insertedId = analysisService.insert(newAnalysis);
        assertNotNull(insertedId);
       
        Analysis retrievedAnalysis = analysisService.get(insertedId);
        assertNotNull(retrievedAnalysis.getFhirUuid());
    }

    @Test
    public void getCSVMultiselectResults_shouldReturnMultiselectResultsAsCSV() {
        Analysis analysis = analysisService.get("2");
        String csvResults = analysisService.getCSVMultiselectResults(analysis);
        assertNotNull(csvResults);
        // Since the test data doesn't explicitly show multiselect results,
        // this test may need adjustment based on actual data
    }

    // @Test
    // public void getTableReferenceId_shouldReturnNonNullId() {
    //     String tableReferenceId = AnalysisService.getTableReferenceId();
    //     assertNotNull(tableReferenceId);
    //     assertEquals("1", tableReferenceId);
    // }
}